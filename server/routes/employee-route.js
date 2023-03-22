//Title:  employee-route.js
//Original Author: Richard Krasso
//Appended by:  John Vanhessche
//Date 20 March 2023
//Description:  Javascript for the employee-route file.

//import statements
const express = require('express')
const Employee = require('../models/employee')    //from the employee.js file.

const router = express.Router()

//the API we'll be using for this application to handle the data being passed over.
//This api is a get request for the empId.  The next object is for errors, which will get forwarded to the error 
//handling section of the index.js file.
/**
 * Using Swagger to document the api.
 * 
 * findEmployeeById
 * @openapi
 * /api/employees/:empId
 *   get:
 *     tags:
 *       - Employees
 *     description:  API for returning an employee document
 *     summary: returns an employee document
 *     parameters:
 *       - name: empId
 *         in: path
 *         required: true
 *         description: Employee document id
 *         schema:
 *           type: number
 *     responses:
 *       '200':
 *         description: Employee document
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Not found
 *       '500':
 *         description: Employee exception
 *       '501':
 *         description: MongoDB Exception
 */
router.get('/:id', (req, res, next) => {

    let empId = req.params.id       //setting the empId to the value entered.
    empId = parseInt(empId, 10)     //using the parseInt method to test for a base-10 number (10 is the radix of parseInt)

    //analyzing empId to ee if the employee id entered was a number.  If not a number, display the id entered and bad request.
    if(isNaN(empId)) {      
        const err = new Error('Bad Request')
        err.status = 400
        console.error('empId could not be parsed:', err.message)
        next(err)
    } else {
        //after verifying the empId is a number, this is the call to mongodb using the mongoose function (findOne) for finding the employee id in the database.  
        //if not found, return error.
        Employee.findOne({'empId': req.params.id}, function(err, emp) {
            if (err) {
                console.error('mongodb error:', err)     //logging error to console window
                next(err)
            } else {
                console.log('emp:', emp)    //shows employee object that was returned form database
                res.send(emp)
            }
        })
    }
})

module.exports = router
