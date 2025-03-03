{
    ("use strict");
    //field name for Projetnum, pre-filled if user has attached project
    const Project_field_code = "ProjectNum";
    //field code lookuped by projectnum
    const Project_Type_field_code = "Project_Type";
    const Customer_Name_field_code = "customer_name";
    const Project_Description_field_code = "Project_Description";
  //field code looked up by engineer naem   
    const Attached_Project_field_code = "Attached_Project";
    const Attached_Project_Type_field_code = "Attached_Project_Type";
  
    const onchange_field_code = [Attached_Project_field_code];
    const triggeringEvent = [
      ...onchange_field_code.map((field) => `app.record.create.change.${field}`),
      ...onchange_field_code.map((field) => `app.record.edit.change.${field}`),
      ...onchange_field_code.map((field) => `app.record.edit.change.${field}`),
    ];
    //User lookup their names-> if user r attached to any project then 'Attached_Project_field_code' field will be populated. on 'Attached_Project_field_code' field change, overwrite Projectnum with attached project name and run lookup automatically->populate 'Project_Type_field_code' (done by lookup not by code)
    
    kintone.events.on(triggeringEvent, function (event) { 
      let record = event.record;
      //the newly selected engineer has a project attached to him/her
      if (record[Attached_Project_field_code].value !== "" &&  record[Attached_Project_field_code].value !== undefined)
      {
        console.log(`ProjectNum = ${record[Attached_Project_field_code].value}`);
        record[Project_field_code].value = record[Attached_Project_field_code].value;
        record[Project_field_code].lookup = true;
        return event;
      }
      //the newly selected engineer has no project attached to him/her,clear project type/customer name/project description
      else
      {
        console.log("New User has no attached project, cleaning up lookup field now");
        record[Project_Type_field_code].value = "";
        record[Customer_Name_field_code].value = "";
        record[Project_Description_field_code].value = "";
        return event;
      }
    });
  }
  