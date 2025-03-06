kintone.events.on(['app.record.edit.change.Status_Radio', 'app.record.create.change.Status_Radio','app.record.index.edit.change.Status_Radio'], function(event) {
    var record = event.record;
    var trigger_status = ['Give Up','Pending','Won','Lost'];
    if (trigger_status.includes(record.Status_Radio.value)) {
        console.log('Active');
        var localDate = new Date();
        if (record.Updated_datetime !== undefined)
        {
          localDate = new Date(record.Updated_datetime.value);
        }
        var noTime = localDate.getFullYear().toString()+'-'+(localDate.getMonth()+1).toString()+'-'+localDate.getDate().toString();
        console.log(noTime);
        record.est_conclusion_date.value = noTime;
    }
    return event;
  });
