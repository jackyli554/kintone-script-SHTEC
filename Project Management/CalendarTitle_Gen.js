(() => {
    'use strict';
    kintone.events.on(['app.record.index.edit.submit', 'app.record.edit.submit', 'app.record.create.submit'], (event) => {
        var record = event.record;
        record.Title_for_Calendar.value = Engineer_Name + " " + ProjectNum + " " + mandays_num + " days";
        return event;
    });
})();