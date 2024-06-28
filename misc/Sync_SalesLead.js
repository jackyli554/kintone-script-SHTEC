//on create Dealer Sales Record
(() => {
    'use strict';
    kintone.events.on(['app.record.create.submit.success'], (event) => {
        console.log("Create Triggered");
        var record = event.record;
        var SalesLead_APP_ID = 260;
        console.log(record);
        var body = {
            'app': SalesLead_APP_ID,
            'record': {
              'Staff_ID': {
                'value': record.StaffID_Lookup.value
              },
              'CustomerName': {
                'value': record.Dealer_Name.value
              },
              'Table': {
                'value': [
                    {
                        "value": {
                            "category" : {
                                "value" : record.Details.value[0].value.category.value
                            },
                            "expected_revenue" :{
                                "value" : record.Details.value[0].value.Sales_amount.value
                            }
                        }

                    }
                ]
              },
              'est_conclusion_date': {
                'value': record.conclusion_date.value
              },
              'Dealer_record_ID': {
                'value' : record.$id.value
              }
            }
          };

          kintone.api(kintone.api.url('/k/v1/record.json', true), 'POST', body, function(resp) {
            // success
            console.log(resp);
            console.log("Create Successful");
          }, function(error) {
            // error
            console.log(error);
          });
    });
//On Edit Submit
kintone.events.on(['app.record.edit.submit.success'], (event) => {
    console.log("Update Triggered");
    var record = event.record;
    var SalesLead_APP_ID = 260;
    console.log(record);
    var body = {
        'app': SalesLead_APP_ID,
        'updateKey': {
            'field': 'Dealer_record_ID',
            'value': record.$id.value
          },
        'record': {
          'Staff_ID': {
            'value': record.StaffID_Lookup.value
          },
          'CustomerName': {
            'value': record.Dealer_Name.value
          },
          'Table': {
            'value': [
                {
                    "value": {
                        "category" : {
                            "value" : record.Details.value[0].value.category.value
                        },
                        "expected_revenue" :{
                            "value" : record.Details.value[0].value.Sales_amount.value
                        }
                    }

                }
            ]
          },
          'est_conclusion_date': {
            'value': record.conclusion_date.value
          }
        }
      };

      kintone.api(kintone.api.url('/k/v1/record.json', true), 'PUT', body, function(resp) {
        // success
        console.log("Update Successful");
        console.log(resp);
      }, function(error) {
        // error
        console.log(error);
      });
});






  })();
//on load Dealer Sales Record

//another script, on load Sales lead