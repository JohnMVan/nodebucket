//Title:  index.js
//Original Author: Richard Krasso
//Appended by:  John Vanhessche
//Date 14 March 2023
//Description:  Javascript file for the index.js.

/**
 * Require statements
 */
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const createError = require('http-errors');
const EmployeeRoute = require('./routes/employee-route')
const swaggerUI = require('swagger-ui-express');     
const swaggerJsdoc = require('swagger-jsdoc');     

const app = express(); // Express variable.

/**
 * App configurations.
 */
app.use(express.json());
app.use(express.urlencoded({'extended': true}));
app.use(express.static(path.join(__dirname, '../dist/nodebucket')));
app.use('/', express.static(path.join(__dirname, '../dist/nodebucket')));

// default server port value.
const PORT = process.env.PORT || 3000;

//connection string to database
const CONN = 'mongodb+srv://nodebucket_user:s3cret@bellevueuniversity.ouotidt.mongodb.net/nodebucket?retryWrites=true&w=majority';

/**
 * Database connection.
 */
mongoose.connect(CONN).then(() => {
  console.log('Connection to the database was successful');
}).catch(err => {
  console.log('MongoDB Error: ' + err.message);
});

//openAPI and Swagger settings
const options = {                               
  definition: {
      openapi: '3.0.0',
      info: {
          title: 'WEB 450 - Nodebucket',
          version: '1.0.0',
      },
  },
  apis: ['./routes/*.js'],
}; 

//Open-API
const openapiSpecification = swaggerJsdoc(options); 

//Swagger
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(openapiSpecification));

//Route
app.use('/api/employees', EmployeeRoute)
// app.use('/api', employeeRoute)

//redirect to add /api-docs to url
app.get('/', async(req, res) => {
  res.redirect('/api-docs');
})

//Error handler for 404 errors.  This is the error handling section for handling the 400, 404, 500 errors.
//Error handling is always done in the index.js or app.js files.
//This function requires the helper class (npm install http-errors) to be installed in your project.  We also
//define a require statement for this above (const createError = require('http-errors))
//If one of the api routes generates an error, it goes to this area first.
//if the error is 404, it forwards the error to the res.send object that builds a json
//message with the error.  If it's not 404, it first sets the res.status to either the error
//given, or 500 if one isn't available, then goes to res.send to display the error.
app.use(function(req, res, next) {
  next(createError(404))
})

app.use(function(err, req, res, next) {

  res.status(err.status || 500)    //setting status for response to the error.  If no status code avail we default to 500.

  //building a json object error to return to whoever called this in our application.  By default express returns html, however we 
  //are overriding this with the json object we are creating in res.send.
  res.send({
    type: 'error',
    status: err.status,
    message: err.message,
    //checking if the app is development version, if so display the entire stack, if not set to undefined.
    stack: req.app.get('env') === 'development' ? err.stack : undefined
  })
})

// Wire-up the Express server.
app.listen(PORT, () => {
  console.log('Application started and listening on PORT: ' + PORT);
})
