//Title:  logger.js
//Original Author: Richard Krasso
//Appended by:  John Vanhessche
//Date 29 March 2023
//Description:  Javascript file for the log files.

const { appendFileSync } = require('fs')   //The [ } means you're only loading what inside not the whole library.
const { join } = require('path')    //to create a file system path to the logging files

//builds string variable that has the entire path to the files.
const debugLog = join( __dirname, 'debug.log')  //directory name and file name
const errorLog = join( __dirname, 'error.log')  //directory name and file name

//this method supplies a date to be used in the logged message
const getDateTime = () => {
    const now = new Date()
    return now.toLocaleString('en-us')
}

//this is the actual export and method that is the actual log message.  logString is made up of the date from
//getDateTime, the word server, followed by the file name specified, and the error message.  It's then appended
//to the end of the file.  
module.exports.debugLogger = (data) => {
    const logString = `[${getDateTime()}] server\t ${data.filename} - ${data.message}\n`
    appendFileSync(debugLog, logString)
}

//same method as above only this is used for the error.log file.
module.exports.errorLogger = (data) => {
    const logString = `[${getDateTime()}] server\t ${data.filename} - ${data.message}\n`
    appendFileSync(errorLog, logString)
}

