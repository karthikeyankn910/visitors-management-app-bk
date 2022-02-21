const express = require('express');
const visitorService = require('../services/visitorService');


const router = express.Router();

// create a visitor POST
router.post('/', (req, res) => {
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
router.get('/', (req, res) => {
    visitorService.getAllVisitors()
        .then(allVisitors => {
            res.status(200).json({"visitors": allVisitors});
        })
        .catch(err => {
            res.status(400).json({"error": err});
        });
});


//get visitor by id GET
router.get('/:visitor_id', (req, res) => {
    visitorService.getVisitorById(req.params.visitor_id)
        .then(visitor => {
            res.status(200).json({"visitor": visitor});
        })
        .catch(err => {
            res.status(400).json({"error": err});
        });
});



//update a visitor PUT
router.put('/:visitor_id', (req, res) => {
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
router.delete('/:visitor_id', (req, res) => {
    visitorService.deleteVisitor(req.params.visitor_id)
    .then(visitor => {
        res.status(200).json({"message": "visitor deleted successfully", "visitor": visitor});
    }).catch(err => {
        res.status(400).json({"error": err});
    });
});



module.exports = router;