(() => {
    'use strict';
    kintone.events.on(['app.record.create.submit','app.record.edit.submit','app.record.index.edit.submit'], (event) => {
      var record = event.record;
  
      console.log("keygen");
      record.monthly_key.value=record.Dealer_Name.value+"-"+record.Details.value[0].value.category.value+"-"+record.year.value.toString()+"-"+record.Month.value.toString()+"-"+record.Staff_Name.value[0].name;
      record.quarterly_key.value=record.Dealer_Name.value+"-"+record.Details.value[0].value.category.value+"-"+record.year.value.toString()+"-"+record.Quarter.value.toString()+"-"+record.Staff_Name.value[0].name;
      record.Relevant_Sales_Amount.value = record.Details.value[0].value.Sales_amount.value;
      record.Relevent_Sales_Quantity.value = record.Details.value[0].value.Sales_Quantity.value;
      return event;
    });
    kintone.events.on(['app.record.create.show'],(event)=>{
      var record = event.record;
      console.log(record);
      if ((record.Action_Category.value!=="")&&(record.Action_Category.value!==undefined))
      {
        console.log("category copying triggered!"); 
        record.Details.value[0].value.category.value = record.Action_Category.value;
        record.StaffID_Lookup.lookup = true;
        record.Dealer_Name.lookup = true
      console.log(record);
      return event;
      }
    });
  })();
  
