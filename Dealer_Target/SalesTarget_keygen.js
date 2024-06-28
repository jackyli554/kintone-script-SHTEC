(() => {
  "use strict";
  const APP_ID = 233;
  const View_ID = 9999;
  kintone.events.on("app.record.index.show", function (event) {
    //Conditional so that the button only shows at speical view
    if (event.viewId !== View_ID) {
      return event;
    }
    //add a button during record listing to bulk refresh keygen
    // Prevent duplication of the button
    if (document.getElementById("my_index_button") != null) {
      return;
    }

    // Set a button
    var myIndexButton = document.createElement("button");
    myIndexButton.id = "my_index_button";
    myIndexButton.innerHTML =
      "Click to Refresh Key of the filtered record(Works only under list view!)";

    // Button onclick function
    //TODO: Dealer_Name->Customer_ID
    //      Staff_Name ->Staff_ID
    myIndexButton.onclick = function () {
      fetch_fast().then(async function (records) {
        console.log(records);

        var commit_records = [];
        for (let i = 0; i < records.length; i++) {
          commit_records.push({
            id: records[i].$id.value,
            record: {
              monthly_key: {
                value:
                  records[i].Dealer_Name.value +
                  "-" +
                  records[i].Details.value[0].value.category.value +
                  "-" +
                  records[i].year.value.toString() +
                  "-" +
                  records[i].Month.value.toString() +
                  "-" +
                  records[i].Staff_Name.value[0].name,
              },
              quarterly_key: {
                value:
                  records[i].Dealer_Name.value +
                  "-" +
                  records[i].Details.value[0].value.category.value +
                  "-" +
                  records[i].year.value.toString() +
                  "-" +
                  records[i].Quarter.value.toString() +
                  "-" +
                  records[i].Staff_Name.value[0].name,
              },
              Relevant_Sales_Amount_arr: {
                value: records[i].Details.value[0].value.Sales_amount.value,
              },
              Relevent_Sales_Quantity_arr: {
                value: records[i].Details.value[0].value.Sales_Quantity.value,
              },
            },
          });
        }

        var done_index = 0;
        console.log("Before Commiting");
        while (done_index < commit_records.length) {
          var body = {
            app: APP_ID,
            records: commit_records.slice(done_index, done_index + 100), //copy 100 records,last record in arr.slice is not copied!
          };
          await kintone.api(
            kintone.api.url("/k/v1/records.json", true),
            "PUT",
            body
          );
          done_index = done_index + 100;
        }

        console.log("Finished bulk update!");
        return event;
      });
    };

    // Retrieve the header menu space element and set the button there
    kintone.app.getHeaderMenuSpaceElement().appendChild(myIndexButton);
  });

  kintone.events.on(
    [
      "app.record.create.submit",
      "app.record.edit.submit",
      "app.record.index.edit.submit",
    ],
    (event) => {
      var record = event.record;

      console.log("keygen");
      record.monthly_key.value =
        record.Dealer_Name.value +
        "-" +
        record.Details.value[0].value.category.value +
        "-" +
        record.year.value.toString() +
        "-" +
        record.Month.value.toString() +
        "-" +
        record.Staff_Name.value[0].name;
      record.quarterly_key.value =
        record.Dealer_Name.value +
        "-" +
        record.Details.value[0].value.category.value +
        "-" +
        record.year.value.toString() +
        "-" +
        record.Quarter.value.toString() +
        "-" +
        record.Staff_Name.value[0].name;
      record.Relevant_Sales_Amount.value =
        record.Details.value[0].value.Sales_amount.value;
      record.Relevent_Sales_Quantity.value =
        record.Details.value[0].value.Sales_Quantity.value;
      return event;
    }
  );

  kintone.events.on(["app.record.create.show"], (event) => {
    //activte on record create finished loading
    var record = event.record;
    console.log(record);
    if (
      record.Action_Category.value !== "" &&
      record.Action_Category.value !== undefined
    ) {
      //Only do if creating record via action button from Sales Target
      console.log("category copying triggered!");
      record.Details.value[0].value.category.value =
        record.Action_Category.value; //copy the category from Dealers Target
      record.StaffID_Lookup.lookup = true; //auto lookup
      record.Dealer_Name.lookup = true;
      console.log(record);
      return event;
    }
  });

  function fetch_fast(opt_last_record_id, opt_records) {
    var records = opt_records || [];
    var query = opt_last_record_id ? "$id > " + opt_last_record_id : "";
    query += " order by $id asc limit 500";
    var params = {
      app: kintone.app.getId(),
      query: query,
    };
    return kintone.api("/k/v1/records", "GET", params).then(function (resp) {
      records = records.concat(resp.records);
      if (resp.records.length === 500) {
        /* If the maximum number of retrievable records was retrieved, there is a possibility that more records exist.
              Therefore, the next 500 records that have a record number larger than the last retrieved record are retrieved.
              Since the records are retrieved all at once in ascending record number order,
              it is possible to retrieve the next 500 records with these conditions.
            */
        return fetch_fast(
          resp.records[resp.records.length - 1].$id.value,
          records
        );
      }
      return records;
    });
  }
})();
