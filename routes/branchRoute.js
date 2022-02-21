const express = require('express');
const branchService = require('../services/branchService');

//initializing router
const router = express.Router();



 
// create a branch POST
router.post('/', (req, res) => {
    branchService.createBranch({
        id: req.body.id,
        name: req.body.name,
        city: req.body.city
    }).then(branch => {
        res.status(201).json({"message": "branch added succesfully", "branch": branch});
    }).catch(err => {
        res.status(400).json({"error": err});
    });
});



//get all branches GET
router.get('/', (req, res) => {
    branchService.getAllBranches()
        .then(allBranches => {
            res.status(200).json({"branches": allBranches});
        })
        .catch(err => {
            res.status(400).json({"error": err});
        });
});


//get branch by id GET
router.get('/:branch_id', (req, res) => {
    branchService.getBranchById(req.params.branch_id)
        .then(branch => {
            res.status(200).json({"branch": branch});
        })
        .catch(err => {
            res.status(400).json({"error": err});
        });
});



//update a branch PUT
router.put('/:branch_id', (req, res) => {
    branchService.updateBranch({
        id: req.body.id,
        name: req.body.name,
        city: req.body.city
    }).then(branch => {
        res.status(200).json({"message": "branch updated successfully", "branch": branch[1]});
    }).catch(err => {
        res.status(200).json({"error": err});
    });
});



//delete a branch DELETE
router.delete('/:branch_id', (req, res) => {
    branchService.deleteBranch(req.params.branch_id)
    .then(branch => {
        res.status(200).json({"message": "branch deleted successfully", "branch": branch});
    }).catch(err => {
        res.status(400).json({"error": err});
    });
});




module.exports = router;