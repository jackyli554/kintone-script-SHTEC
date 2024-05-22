//helper func
function fetch_fast(opt_last_record_id, opt_records) {
    var records = opt_records || [];
    var query = opt_last_record_id ? '$id > ' + opt_last_record_id : '';
    query += ' order by $id asc limit 500';
    var params = {
      app: kintone.app.getId(),
      query: query
    };
    return kintone.api('/k/v1/records', 'GET', params).then(function(resp) {
      records = records.concat(resp.records);
      if (resp.records.length === 500) {
        /* If the maximum number of retrievable records was retrieved, there is a possibility that more records exist.
          Therefore, the next 500 records that have a record number larger than the last retrieved record are retrieved.
          Since the records are retrieved all at once in ascending record number order,
          it is possible to retrieve the next 500 records with these conditions.
        */
        return fetch_fast(resp.records[resp.records.length - 1].$id.value, records);
      }
      return records;
    });
  }
  
  fetch_fast().then(function(records) {
    return records;
  });