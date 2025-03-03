(() => {
    'use strict';
    const App_ID = 235;
    kintone.events.on('mobile.app.record.index.show', function(event) { //add a button during record listing to bulk refresh title
        // Prevent duplication of the button
        if (document.getElementById('my_index_button') != null) {
            return;
        }
        // Set a button
        var myIndexButton = document.createElement('button');
        myIndexButton.id = 'my_index_button';
        myIndexButton.innerHTML = 'Click to Refresh Calendar Title(Works only under list view!)';

        // Button onclick function
        myIndexButton.onclick = function() {
            var records = event.records;
            var recordID_arr = [];
            var calendarTitle_arr = [];
            records.forEach((record) => {
                recordID_arr.push(record.$id.value);
                //update JSON body
                calendarTitle_arr.push(record.Engineer_Name.value + " " + record.ProjectNum.value + " " + record.mandays_num.value + " days" + " " + record.work_multiline.value)
            });

            console.log(recordID_arr);
            console.log(calendarTitle_arr);
            var records = [];
            for (let i = 0; i < recordID_arr.length; i++) {
                records.push({
                    "id": recordID_arr[i],
                    "record": { 
                        "Title_for_Calendar": {
                            "value": calendarTitle_arr[i]
                        }
                    }
                })
            }
            var body = {
                'app': App_ID,
                'records': records
            };
            kintone.api(kintone.api.url('/k/v1/records.json', true), 'PUT', body, function(resp) {
                // success
                console.log(resp);
            }, function(error) {
                // error
                console.log(error);
            });
            console.log(JSON.stringify(body));
            console.log("Finished bulk update!");
            return event;

        };

        // Retrieve the header menu space element and set the button there
        kintone.mobile.app.getHeaderMenuSpaceElement().appendChild(myIndexButton);
    });

    //Event listener for record create and edit,note that mobile JS API does not support detail view inline edit.
    kintone.events.on(['mobile.app.record.edit.submit', 'mobile.app.record.create.submit'], (event) => { //Generate calendar title at save(create/edit/inline edit)
        var record = event.record;
        record.Title_for_Calendar.value = record.Engineer_Name.value + " " + record.ProjectNum.value + " " + record.mandays_num.value + " days" + " " + record.work_multiline.value;
        return event;
    });
})();