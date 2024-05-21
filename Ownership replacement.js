(() => { //main
    'use strict';
    ///////const for Target APP
    const App_ID = 44; //Target App ID
    const staffID_fieldname = 'Lookup_0';
    ///////////get affected records
    function BulkUpdate(updateentryID_arr, RCV_ID) {
        var body = {
            'app': App_ID
        };
        var records = [];
        for (var i in updateentryID_arr) {
            var item = updateentryID_arr[i];
            records.push({
                "id": item,
                "record": {
                    [staffID_fieldname]: {
                        "value": RCV_ID
                    }
                }
            });
        }

        body.records = records;
        console.log(JSON.stringify(body));
        kintone.api(kintone.api.url('/k/v1/records.json', true), 'PUT', body, function(commit_resp) {
            // success
            console.log(JSON.stringify(commit_resp));
            console.log(commit_resp.records.length);
            return commit_resp.records.length;
        }, function(error) {
            // error
            console.log(JSON.stringify(error));
            window.alert("Problem on swapping staff ID");
            return -1;
        });
    }

    kintone.events.on('app.record.create.submit', function(ev) {
        var bulk_changeform = ev.record;
        console.log(JSON.stringify(bulk_changeform));
        var body = {
            'app': App_ID,
            'query': staffID_fieldname + "=" + bulk_changeform.Giver_ID.value, //Staff ID == Giver ID
            'fields': ['$id', staffID_fieldname] // get record ID
        };


        kintone.api(kintone.api.url('/k/v1/records.json', true), 'GET', body, function(resp) {
                // success
                console.log(JSON.stringify(resp));
                var updateentryID_arr = [];
                for (let i = 0; i < resp.records.length; i++) {
                    updateentryID_arr[i] = resp.records[i].$id.value;
                }
                console.table(updateentryID_arr);
                ev.record.affected_num.value = BulkUpdate(updateentryID_arr, bulk_changeform.RCV_ID.value);
            },
            function(error) {
                // error
                console.log(JSON.stringify(error));
                window.alert("Problem on looking up records");

            });
        console.log("returning EV");
        console.log(JSON.stringify(ev));
        return ev;
    });

})();