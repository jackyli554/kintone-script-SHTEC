(() => {
    //main
    'use strict';
    ///////const for Target APP
    const App_ID = 44; //Target App ID
    const staffID_fieldname = 'Lookup_0';
    ///////////get affected records


    kintone.events.on('app.record.create.submit', async(ev) => {
        try {
            var bulk_changeform = ev.record;
            console.log(JSON.stringify(bulk_changeform));
            var body = {
                'app': App_ID,
                'query': staffID_fieldname + "=" + bulk_changeform.Giver_ID.value, //Staff ID == Giver ID
                'fields': ['$id', staffID_fieldname] // get record ID
            };
            const resp = await kintone.api(kintone.api.url('/k/v1/records.json', true), 'GET', body);
            // success
            console.log(JSON.stringify(resp));
            if (resp.totalCount = 0) {
                Console.log("No Sales Lead records related to the Giver staff ID!");
                ev.record.affected_num.value = 0;
                return ev;
            }
            var updateentryID_arr = [];
            for (let i = 0; i < resp.records.length; i++) {
                updateentryID_arr[i] = resp.records[i].$id.value;
            }
            var body = {
                'app': App_ID
            };
            var modified_records = [];
            for (var i in updateentryID_arr) {
                var item = updateentryID_arr[i];
                modified_records.push({
                    "id": item,
                    "record": {
                        [staffID_fieldname]: {
                            "value": bulk_changeform.RCV_ID.value
                        }
                    }
                });
            }
            body.records = modified_records;

            const commit_resp = await kintone.api(kintone.api.url('/k/v1/records.json', true), 'PUT', body);
            console.log(commit_resp);
            if (commit_resp.records.length != resp.records.length) {
                console.warn("Commit resp length does not match fetch resp length!")
                console.warn(commit_resp.records)
                ev.record.affected_num.value = commit_resp.records.length * -1;
            } else ev.record.affected_num.value = commit_resp.records.length;
            // success
            console.log("returning EV");
            console.log(JSON.stringify(ev));
        } catch (err) {
            console.error(err);
        }
        return ev;
    });
})();