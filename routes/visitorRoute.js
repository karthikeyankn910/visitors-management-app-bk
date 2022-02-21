const express = require('express');
const visitorService = require('../services/visitorService');
const { validate, ValidationError, Joi } = require('express-validation');
const { Visitor } = require('../db_conn/db');

//initializing router
const router = express.Router();



//schema to validate the request body and catching errors (refer last code block)
const bodyValidation = {
    body: Joi.object({
        id: Joi.required(),
        name: Joi.string().required().min(3),
        email: Joi.string().email().required(),
        phone: Joi.string(),
        purpose: Joi.string(),
        designation: Joi.string(),
        organization: Joi.string(),
        city: Joi.string().required().min(3),
        check_in: Joi.string(),
        check_out: Joi.any().empty(),
        other_info: Joi.object(),
        branch_id: Joi.required(),
        emp_id: Joi.required()
    }), 
}

//schema to validate the query string from the request
const queryValidation = {
    query: Joi.object({
        city: Joi.string(),
        purpose: Joi.string(),
        organization: Joi.string(),
        branch_id: Joi.number(),
        emp_id: Joi.number(),
    })
}

//getting conditions according to the query string from the request
var getQueryCondition = (req, res, next) => {
    let city = req.query.city;
    let purpose = req.query.purpose;  
    let organization = req.query.organization;
    let branch_id = req.query.branch_id;
    let emp_id = req.query.emp_id;

    let conditions = {};
    conditions.where = {};
    
    if (city) conditions.where.city = city;
    if (purpose) conditions.where.purpose = purpose; 
    if (organization) conditions.where.organization = organization;
    if (branch_id) conditions.where.branch_id = branch_id;
    if (emp_id) conditions.where.emp_id = emp_id;

    req.conditions = conditions;
    next();
}


var checkExistOrNot = (req, res, next) => {
    Visitor.findOne({
        where: {
            id: req.params.visitor_id
        }
    }).then(visitor => {
        if (visitor) {
            req.visitor = visitor;
            next();
            return;
        }
        res.status(404).json({"message": "Visitor not exists"});
    }).catch(err => {
        res.status(400).json({"error": err});
    })
}






/*
    END POINST STARTS...... HERE YOU GO.....
*/






// create a visitor POST
router.post('/', 
    validate(bodyValidation, {}, {}),
    (req, res) => {
        visitorService.createVisitor({
            id: req.body.id,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            purpose: req.body.purpose, 
            designation: req.body.designation,
            organization: req.body.organization,
            city: req.body.city,
            check_in: req.body.check_in,
            check_out: req.body.check_out,
            other_info: req.body.other_info,
            branch_id: req.body.branch_id,
            emp_id: req.body.emp_id,
        }).then(visitor => {
            res.status(201).json({"message": "visitor added succesfully", "visitor": visitor});
        }).catch(err => {
            res.status(400).json({"error": err});
        });
});



//get all visitors GET
router.get('/', 
    validate(queryValidation,{},{}),
    getQueryCondition,
    (req, res) => {  
        visitorService.getAllVisitors(req.conditions)
            .then(allVisitors => {
                res.status(200).json({"visitors": allVisitors});
            })
            .catch(err => {
                res.status(400).json({"error": err});
            });
});


//get visitor by id GET
router.get('/:visitor_id', 
    checkExistOrNot,
    (req, res) => { 
        res.status(200).json({"visitor": req.visitor});
         
});



//update a visitor PUT
router.put('/:visitor_id', 
    validate(bodyValidation, {}, {}),
    checkExistOrNot,
    (req, res) => {
        visitorService.updateVisitor({
            id: req.body.id,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            purpose: req.body.purpose, 
            designation: req.body.designation,
            organization: req.body.organization,
            city: req.body.city,
            check_in: req.body.check_in,
            check_out: req.body.check_out,
            other_info: req.body.other_info,
            branch_id: req.body.branch_id,
            emp_id: req.body.emp_id,
        }).then(visitor => {
            res.status(200).json({"message": "visitor updated successfully", "visitor": visitor[1]});
        }).catch(err => {
            res.status(200).json({"error": err});
        });
});



//delete a visitor DELETE
router.delete('/:visitor_id', 
    checkExistOrNot,
    (req, res) => {
    visitorService.deleteVisitor(req.params.visitor_id)
        .then(visitor => {
            res.status(200).json({"message": "visitor deleted successfully", "visitor": visitor});
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