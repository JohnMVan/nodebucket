//Title:  employee.js
//Original Author: Richard Krasso
//Appended by:  John Vanhessche
//Date 20 March 2023
//Description:  Javascript for the employee.js file

//import statements
const mongoose = require('mongoose')
const Schema = mongoose.Schema

//This is the schema we need for the data for the mongoose database, for the employees collection.
//this matches the mongoose collection we created.  the empId is always going to be required, and it needs to
//be unique.  
let employeeSchema = new Schema ({
    empId: {type: Number, unique: true, required: true},
    firstName: {type: String},
    lastName: {type: String}
}, { collection: 'employees' })   //specifying which collection this model should be connected to.

//exporting the module so we can access from other files in our app.  Giving the export the name of Employee,
//and binding this to the emmployeeSchema.
module.exports = mongoose.model('Employee', employeeSchema)