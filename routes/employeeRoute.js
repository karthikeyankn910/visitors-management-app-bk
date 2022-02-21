const express = require('express');
const employeeService = require('../services/employeeService');

//initializing router
const router = express.Router();



 
// create a employee POST
router.post('/', (req, res) => {
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
router.get('/', (req, res) => {
    employeeService.getAllEmployees()
        .then(allEmployees => {
            res.status(200).json({"employeees": allEmployees});
        })
        .catch(err => {
            res.status(400).json({"error": err});
        });
});


//get employee by id GET
router.get('/:employee_id', (req, res) => {
    employeeService.getEmployeeById(req.params.employee_id)
        .then(employee => {
            res.status(200).json({"employee": employee});
        })
        .catch(err => {
            res.status(400).json({"error": err});
        });
});



//update a employee PUT
router.put('/:employee_id', (req, res) => {
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
router.delete('/:employee_id', (req, res) => {
    employeeService.deleteEmployee(req.params.employee_id)
    .then(employee => {
        res.status(200).json({"message": "employee deleted successfully", "employee": employee});
    }).catch(err => {
        res.status(400).json({"error": err});
    });
});




module.exports = router;