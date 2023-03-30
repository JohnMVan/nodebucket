//Title:  item.js
//Original Author: Richard Krasso
//Appended by:  John Vanhessche
//Date 14 March 2023
//Description:  Javascript file for the item.

const mongoose = require('mongoose')
const Schema = mongoose.Schema


//this is the schema for validating when the user enters a new task.  fairly simple, just looking for a string
//of characters.  

let itemSchema = new Schema({
    text: { type: String}
})

module.exports = itemSchema