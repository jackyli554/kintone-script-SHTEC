(() => {
    'use strict';
    const APP_ID = 229;
    kintone.events.on('app.record.index.show', function(event) { //add a button during record listing to bulk refresh keygen
        // Prevent duplication of the button
        if (document.getElementById('my_index_button') != null) {
            return;
        }
        // Set a button
        var myIndexButton = document.createElement('button');
        myIndexButton.id = 'my_index_button';
        myIndexButton.innerHTML = 'Click to Refresh Key of the filtered record(Works only under list view!)';

        // Button onclick function
            console.log(JSON.stringify(event));

        myIndexButton.onclick = function() {
            var records = event.records;
            var recordID_arr = [];
            var monthly_key_arr= [];
            var quarterly_key_arr = [];
            var Relevant_Sales_Amount_arr = [];
            var Relevent_Sales_Quantity_arr = [];
            records.forEach((record) => {
                recordID_arr.push(record.$id.value);
                //update JSON body
                // monthly_key_arr.push(record.Dealer_Name.value+"-"+record.Details.value[0].value.category.value+"-"+record.year.value.toString()+"-"+record.Month.value.toString()+"-"+record.Staff_Name.value[0].name);
                // quarterly_key_arr.push( record.Dealer_Name.value+"-"+record.Details.value[0].value.category.value+"-"+record.year.value.toString()+"-"+record.Quarter.value.toString()+"-"+record.Staff_Name.value[0].name);
                // Relevant_Sales_Amount_arr.push(record.Details.value[0].value.Sales_amount.value);
                // Relevent_Sales_Quantity_arr.push(record.Details.value[0].value.Sales_Quantity.value);
            });
        const Query_body ={
            app:kintone.app.getId(),
            'query' : 'limit 500 '
        }
/* ##TODO
use REST API get all record <-fast_fetch in helper js


*/
            console.log(recordID_arr);
            var records = [];
            for (let i = 0; i < recordID_arr.length; i++) {
                records.push({
                    "id": recordID_arr[i],
                    "record": { 
                        "monthly_key": {
                            "value": monthly_key_arr[i]
                        },
                        "quarterly_key" : {
                            "value" : quarterly_key_arr[i]
                        },
                        "Relevant_Sales_Amount_arr" :{
                            "value" : Relevant_Sales_Amount_arr[i]
                        },
                        "Relevent_Sales_Quantity_arr" : {
                            "value" : Relevent_Sales_Quantity_arr[i]
                        }

                    }
                })
            }
            var body = {
                'app': APP_ID,
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
        kintone.app.getHeaderMenuSpaceElement().appendChild(myIndexButton);
    });
    
    kintone.events.on(['app.record.create.submit','app.record.edit.submit','app.record.index.edit.submit'], (event) => {
      var record = event.record;
  
      console.log("keygen");
      record.monthly_key.value=record.Dealer_Name.value+"-"+record.Details.value[0].value.category.value+"-"+record.year.value.toString()+"-"+record.Month.value.toString()+"-"+record.Staff_Name.value[0].name;
      record.quarterly_key.value=record.Dealer_Name.value+"-"+record.Details.value[0].value.category.value+"-"+record.year.value.toString()+"-"+record.Quarter.value.toString()+"-"+record.Staff_Name.value[0].name;
      record.Relevant_Sales_Amount.value = record.Details.value[0].value.Sales_amount.value;
      record.Relevent_Sales_Quantity.value = record.Details.value[0].value.Sales_Quantity.value;
      return event;
    });
    kintone.events.on(['app.record.create.show'],(event)=>{  //activte on record create finished loading
      var record = event.record;
      console.log(record);
      if ((record.Action_Category.value!=="")&&(record.Action_Category.value!==undefined)) //Only do if creating record via action button from Sales Target
      {
        console.log("category copying triggered!"); 
        record.Details.value[0].value.category.value = record.Action_Category.value;//copy the category from Dealers Target
        record.StaffID_Lookup.lookup = true;//auto lookup
        record.Dealer_Name.lookup = true
      console.log(record);
      return event;
      }
    });
  })();