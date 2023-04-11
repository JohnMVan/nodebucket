//Title:  employee-route.js
//Original Author: Richard Krasso
//Appended by:  John Vanhessche
//Date 27 March 2023
//Description:  Javascript for the employee-route file.

//import statements
const express = require('express')
const Employee = require('../models/employee')    //from the employee.js file.
const { debugLogger, errorLogger } = require('../logs/logger')
const createError = require('http-errors')
const Ajv = require('ajv')
const BaseResponse = require('../models/base-response')

const router = express.Router()
const myFile = 'employee-route.js'
const ajv = new Ajv()

//This function checks if the user id entered is a number.  If so, it returns false, if not it returns 
//a 400 error and logs the error to the error error log file (errorLogger method)
const checkNum = (id) => {
    id = parseInt(id, 10)
    if (isNaN(id)) {
        const err = new Error('Bad Request')
        err.stats = 400
        console.error('id could not be parsed:', id)
        errorLogger({filename: myFile, message: `id could not be parsed: ${id}`})
        return err
    } else {
        return false
    }
}

/**
 * data from angular application
 */

// const data = 
// {
//     "todo": [
//         {
//             "text": "go to bed" 
//         },
//         {
//             "text": "work on homework"
//         }
//     ],
//     "done": [
//         {
//             "text": "turn in"
//         },
//         {
//             "text": "blah"
//         }
//     ]
// }

//This schema is set for the task entered.  For starters, there must be some type of text inputted (required)
const taskSchema = {
    type: 'object',
    properties: {
        text: {type: 'string'}
    },
    required: ['text'],
    additionalProperties: false
}

const tasksSchema = {
    type: 'object',
    required: ['todo', 'done'],
    additionalProperties: false,
    properties: {
        todo: {
            type: 'array',
            additionalProperties: false,
            items: {
                type: 'object',
                properties: {
                    text: { type: 'string' },
                    _id: { type: 'string' }
                },
                required: ['text', '_id'],
                additionalProperties: false
            }
        },
        done: {
            type: 'array',
            additionalProperties: false,
            items: {
                type: 'object',
                properties: {
                    text: { type: 'string' },
                    _id: { type: 'string' }
                },
                required: ['text', '_id'],
                additionalProperties: false
            }
        }
    }
}

function getTask(id, tasks) {
    const task = tasks.find(item => item._id.toString() === id)
    return task
}

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
    const err = checkNum(empId)
    
    //if an error WAS NOT generated...i.e. the result of checkNum = false, then use the findOne function to find the employee
    //in the database.  
    // 3/27 * note* As of right now, this only returning http status codes, 200 if the id is found, etc.
    if (err === false) {                  

        Employee.findOne({'empId': req.params.id}, function(err, emp) {
            if (err) {
                console.error('mongodb error:', err)     //logging error to console window
                errorLogger({filename: myFile, message: `mongodb error: ${err.message}`})    //logging error to error log file.
                next(err)
            } else {
                console.log('emp:', emp)    //shows employee object that was returned form database
                debugLogger({filename: myFile, message: emp})
                res.send(emp)
            }
        })
    } else {
        console.error('empId could not be parsed:', err.message)
        errorLogger({filename: myFile, message: `empId could not be parsed: ${err.message}`})
        next(err)        
    }
})

/**
 * 
 * findAllTasks
 * 
 * @openapi
 * /api/employees/{empId}/tasks:
 *   get:
 *     tags:
 *       - Employees
 *     name: findAllTasks
 *     description: API for returning all tasks by empId
 *     summary: returns a task document
 *     parameters:
 *       - name: empId
 *         in: path
 *         required: true
 *         description: employee id in MongoDB
 *         schema:
 *           type: number
 *     responses:
 *       '200':
 *         description: Document for all employee tasks
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Not found
 *       '500':
 *         description: Employee Exception
 *       '501':
 *         description: MongoDB Exception
 */

router.get('/:empId/tasks', async(req, res, next) => {

    let empId = req.params.empId
    
    const err = checkNum(empId)

    //if error is false....we have a validated id.....then use empId to filter the document for the todo and done tasks
    //we use a try/catch statement block to do this.  If we cannot filter, then we log the error
    if (err === false) {

        try {
            const emp = await Employee.findOne({'empId': empId}, 'empId todo done')

            if (emp) {
                console.log(emp)
                debugLogger({filename: myFile, message: emp})
                res.send(emp)
            } else {
                console.error(createError(404))
                errorLogger({filename: myFile, message: createError(404)})
                next(createError(404))
            }

        } catch (err) {
            errorLogger({filename: myFile, message: err})
            next(err)
        }

    //if we cannot verify the empId, we generate an error message in errorString and log this to the error log file.
    } else {
        const errorString = `req.params must be a number: ${empId}`
        console.error(errorString)
        errorLogger({filename: myFile, message: errorString})
        next(err)
    }
})

/**
 * createTask
 * 
 * @openapi
 * /api/employees/{empId}/tasks:
 *   post:
 *     tags:
 *       - Employees
 *     name: createTask
 *     summary: document for a task created by the employee
 *     parameters:
 *        - name: empId
 *          in: path
 *          required: true
 *          description: document of empId type
 *          schema:
 *            type: number
 *     requestBody:
 *       description: document of tasks filtered by empId
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Success - new task added to MongoDB
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Not found
 *       '500':
 *         description:  Exception
 *       '501':
 *         description: MongoDB Exception
 */

//records the task the user enters and adds to the database
router.post('/:empId/tasks', async(req, res, next) => {
    let empId = req.params.empId

    const err = checkNum(empId)

    if (err === false) {
        try {
            let emp = await Employee.findOne({'empId': empId})

            if (emp) {
                const newTask = req.body   //grabbing data from body of http request
                const validator = ajv.compile(taskSchema)
                const valid = validator(newTask)

                if (!valid) {
                    const err = Error('Bad Request')
                    err.status = 400
                    console.error('Bad Request.  Unable to validate req.body against the defined schema')
                    errorLogger({filename:  myFile, message: err})
                    next(err)
                } else {
                    emp.todo.push(newTask)
                    const result = await emp.save()
                    console.log(result)
                    debugLogger({filename: myFile, message: result})

                    //want to get the last record, the one that was added with the push
                    const task = result.todo.pop()   

                    const newTaskResponse = new BaseResponse(201, 'Task added successfully', {id: task._id})
                    res.status(201).send(newTaskResponse)                    
                }
            } else {
                console.error(createError(404))
                errorLogger({filename: myFile, message: createError(404)})
                next(createError(404))
            }

        } catch (err) {
            next(err)
        }
    } else {
        console.error('req.params.empId must be a number', empId)
        errorLogger({filename: myFile, message: `req.params.empId must be a number ${empId}`})
        next(err)
    }
})

/**
 * updateTasks
 * @openapi
 * /api/employees/{id}/tasks:
 *   put:
 *     tags:
 *       - Employees
 *     description: Update tasks for an employee
 *     summary: updates the tasks for an employee
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - todo
 *               - done             
 *             properties:
 *               todo:
 *                 type: array                 
 *               done:
 *                 type: array                               
 *     responses:
 *       '204':
 *         description: Task updated
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Employee not found
 *       '500':
 *         description:  Exception
 *       '501':
 *         description: MongoDB Exception
 */
//update task api
router.put('/:empId/tasks', async(req, res, next) => {
    let empId = req.params.empId
    empId = parseInt(empId, 10)

    if (isNaN(empId)) {
        const err = Error('input must be a number')
        err.status = 400
        console.error('input must be a number:', empId)
        errorLogger({filename: myFile, message: `input must be a number:' ${empId}`})
        next(err)
        return
    }

    //early return design pattern in use here.
    try {
        let emp = await Employee.findOne({'empId': empId})

        if (!emp) {            
            console.error(createError(404))
            errorLogger({filename: myFile, message: createError(404)})
            next(createError(404))    //next call should be last
            return
        }

        const tasks = req.body
        const validator = ajv.compile(tasksSchema)
        const valid = validator(tasks)

        if (!valid) {
            const err = Error('Bad Request')
            err.status = 400
            console.error('Bad Request.  Unable to validate req.body against tasksSchema')
            errorLogger({filename: myFile, message: `Bad Request.  Unable to verify against tasksSchema`})
            next(err)
            return
        }

        emp.set({
            todo: req.body.todo,
            done: req.body.done
        })

        const result = await emp.save()
        console.log(result)
        debugLogger({filename: myFile, message: result})
        res.status(204).send()

    } catch (err) {
        next(err)
    }
})

/**
deleteTask
 * @openapi
 * /api/employees/{id}/tasks/{taskId}:
 *   delete:
 *     tags:
 *       - Employees
 *     description: Deleting from an employee API
 *     summary: deletes a todo or done task for an employee
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Id of the user in Mongo
 *         schema:
 *           type: integer
 *       - name: taskId
 *         description: Id of the task on Mongo
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Task deleted
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Employee not found
 *       '500':
 *         description:  Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.delete('/:empId/tasks/:taskId', async(req, res, next) => {
    let taskId = req.params.taskId
    let empId = req.params.empId
    
    empId = parseInt(empId, 10)

    if (isNaN(empId)) {
        const err = Error('input must be a number')
        err.status = 400
        console.error('req params.empId must be a number:', empId)
        errorLogger({filename: myFile, message: `req params.empId must be a number ${empId}`})
        next(err)
        return
    }

    try {
        let emp = await Employee.findOne({'empId': empId})

        if(!emp) {
            next(createError(404))
            console.error(createError(404))
            errorLogger({filename: myFile, message: createError(404)})
            next(err)
            return
        }

        //need to find which array the task has been added to.  Call the get task function
        //to find the document _id 

        const todoTask = getTask(taskId, emp.todo)
        const doneTask = getTask(taskId, emp.done)

        if (todoTask !== undefined) {
            emp.todo.id(todoTask._id).remove()
        }

        if (doneTask !== undefined) {
            emp.done.id(doneTask._id).remove()
        }

        if (todoTask === undefined && doneTask === undefined) {
            const err = Error('Not Found')
            err.status = 404
            console.error('TaskId not found', taskId)
            errorLogger({filename: myFile, message: `TaskId not found ${taskId}`})
            next(err)
            return
        }

        const result = await emp.save()
        debugLogger({filename: myFile, message: result})
        res.status(204).send()

    } catch (err) {
        next(err)
    }
})


module.exports = router
