//Title:  employee.js
//Original Author: Richard Krasso
//Appended by:  John Vanhessche
//Date 27 March 2023
//Description:  Javascript for the employee.js file

//import statements
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const itemSchema = require('./item')

//This is the schema we need for the data for the mongoose database, for the employees collection.
//this matches the mongoose collection we created.  the empId is always going to be required, and it needs to
//be unique.  
//During day 11, we added the todo and done properties, which are both arrays.

let employeeSchema = new Schema ({
    empId: {type: Number, unique: true, required: true},
    firstName: {type: String},
    lastName: {type: String},
    todo: [itemSchema],
    done: [itemSchema]
}, { collection: 'employees' })   //specifying which collection this model should be connected to.

//exporting the module so we can access from other files in our app.  Giving the export the name of Employee,
//and binding this to the emmployeeSchema.
module.exports = mongoose.model('Employee', employeeSchema)