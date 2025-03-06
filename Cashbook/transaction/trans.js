  //Make the Trans ID and the O/S balance to be read-only
  var trigger_event = [
    'app.record.index.edit.show',
    'app.record.detail.show',
    'app.record.create.show',
    'app.record.edit.show',
  ]
  kintone.events.on(trigger_event, function (ev) {
    var record = ev.record
//    record['Transaction_No'].disabled = true
    record['OS_Deposit'].disabled = true
    return ev
  })
  //Recalc the O/S deposit in case user changes the deposit or settled amount changed
  var trigger_event = [
    'app.record.index.edit.show',
    'app.record.detail.show',
    'app.record.create.show',
    'app.record.edit.show',
    'app.record.edit.change.Deposit',
    'app.record.create.change.Deposit',
  ]
  kintone.events.on(trigger_event, function (ev) {
    var record = ev.record
    record['OS_Deposit'].value = (isNaN(record['OS_Deposit'].value)? 0:record['Deposit'].value - record['total_settled'].value)
    return ev
  })

  //Check Balance = 0 or cancel submit
  var trigger_event = ['app.record.create.submit', 'app.record.edit.submit']
  kintone.events.on(trigger_event, function (ev) {
    var record = ev.record
    if (record.Balance.value != 0) {
      ev.error = 'Balance must be 0!'
      return ev
    }
    return ev
  })
  var trigger_event = ['app.record.create.submit.success']
  // Auto-generate Transaction No. after submit success
 /* kintone.events.on(trigger_event, function (ev) {
    var record = ev.record
    const date = new Date(record.Date.value)
    const month = date.getMonth() + 1
    let padToFive = ev.recordId <= 99999 ? `0000${ev.recordId}`.slice(-5) : ev.recordId
    var body = {
      app: ev.appId,
      id: ev.recordId,
      record: {
        Transaction_No: {
          value: (
            "C"+
            date.getFullYear().toString().slice(2) +
            (month <= 9 ? '0' + month.toString() : month.toString()) +
            padToFive
          ).toString(),
        },
      },
    }
    kintone.api(
      kintone.api.url('/k/v1/record.json', true),
      'PUT',
      body,
      function (resp) {
        // success
        console.log(resp)
      },
      function (error) {
        // error
        console.log(error)
      },
    )
  })*/

