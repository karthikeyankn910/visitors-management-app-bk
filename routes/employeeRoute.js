const express = require('express'); 
const employeeService = require('../services/employeeService');
const { validate, ValidationError, Joi } = require('express-validation'); 
const download = require('../export_logic/getData');

//initializing router
const router = express.Router();



//schema to validate the request body and catching errors (refer last code block)
const bodyValidation = {
    body: Joi.object({
        id: Joi.required(),
        name: Joi.string().required().min(3),
        email: Joi.string().email().required(),
        phone: Joi.string(),
        designation: Joi.string(),
        city: Joi.string().required().min(3),
        branch_id: Joi.required()
    }),
}


//schema to validate the query string from the request
const queryValidation = {
    query: Joi.object({
        city: Joi.string(),  
        designation: Joi.string(),
        branch_id: Joi.number(), 
    })
}

//getting conditions according to the query string from the request
var getQueryCondition = (req, res, next) => {  
    let { city, designation, branch_id } = req.query;

    let conditions = {};
    conditions.where = {};
    
    if (city) conditions.where.city = city; 
    if (designation) conditions.where.designation = designation;
    if (branch_id) conditions.where.branch_id = branch_id; 

    req.conditions = conditions;
    next();
}



var checkExistOrNot = (req, res, next) => {
    const { employee_id } = req.params;
    employeeService.getEmployeeById(employee_id)
        .then(employee => {
            if (employee) {
                req.employee = employee;
                next();
                return;
            }
            res.status(404).json({"message": "Employee not exists"});
        }).catch(err => {
            res.status(400).json({"error": err});
        })
}





/*
    END POINST STARTS...... HERE YOU GO.....
*/





 
// create a employee POST
router.post('/', 
    validate(bodyValidation, {}, {}),
    (req, res) => {
        employeeService.createEmployee({
            id: req.body.id,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            designation: req.body.designation,
            city: req.body.city,
            branch_id: req.body.branch_id, 
        }).then(employee => {
            res.status(201).json({"message": "employee added succesfully", "employee": employee});
        }).catch(err => {
            res.status(400).json({"error": err});
        });
});

 


//get all employeees GET
router.get('/', 
    validate(queryValidation, {}, {}),
    getQueryCondition,
    (req, res) => {
        employeeService.getAllEmployees(req.conditions)
            .then(allEmployees => {
                res.status(200).json({"employeees": allEmployees});
            })
            .catch(err => {
                res.status(400).json({"error": err});
            });
});




// download employee table as csv file
router.get('/download', (req, res) => {
    download(req, res, "employee");  
});




//get employee by id GET
router.get('/:employee_id', 
    checkExistOrNot,
    (req, res) => { 
        res.status(200).json({"employee": req.employee});
            
});



//update a employee PUT
router.put('/:employee_id', 
    validate(bodyValidation, {}, {}),
    checkExistOrNot,
    (req, res) => {
        employeeService.updateEmployee({
            id: req.body.id,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            designation: req.body.designation,
            city: req.body.city,
            branch_id: req.body.branch_id,
        }).then(employee => {
            res.status(200).json({"message": "employee updated successfully", "employee": employee[1]});
        }).catch(err => {
            res.status(200).json({"error": err});
        });
});



//delete a employee DELETE
router.delete('/:employee_id', 
    checkExistOrNot,
    (req, res) => {
        employeeService.deleteEmployee(req.params.employee_id)
        .then(employee => {
            res.status(200).json({"message": "employee deleted successfully", "employee": employee});
        }).catch(err => {
            res.status(400).json({"error": err});
        });
});




router.use(function(err, req, res, next){
    if (err instanceof ValidationError) {
        return res.status(err.statusCode).json(err);
    }
    return res.status(500).json(err);
});



module.exports = router;