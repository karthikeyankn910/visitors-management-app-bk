const express = require('express');
const branchService = require('../services/branchService');
const { validate, ValidationError, Joi } = require('express-validation'); 
const download = require('../export_logic/getData');


//initializing router
const router = express.Router();


//schema to validate the request body and catching errors (refer last code block)
const bodyValidation = {
    body: Joi.object({
        id: Joi.required(),
        name: Joi.string().required().min(3),
        city: Joi.string().required().min(3),
    }),
}
 

var checkExistOrNot = (req, res, next) => {
    const { branch_id } = req.params;
    branchService.getBranchById(branch_id)
        .then(branch => {
            if (branch) {
                req.branch = branch;
                next();
                return;
            }
            res.status(404).json({"message": "Branch not exists"});
        }).catch(err => {
            res.status(400).json({"error": err});
        })
}



/*
    END POINST STARTS...... HERE YOU GO.....
*/


 
// create a branch POST
router.post('/', 
    validate(bodyValidation, {}, {}), 
    (req, res) => {
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



// download  branch table as csv file
router.get('/download', (req, res) => {
    download(req, res, "branch");  
});



// get branch by id GET
router.get('/:branch_id', 
    checkExistOrNot,
    (req, res) => { 
        res.status(200).json({"branch": req.branch}); 
});




//update a branch PUT
router.put('/:branch_id', 
    validate(bodyValidation, {}, {}), 
    checkExistOrNot,
    (req, res) => {
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
router.delete('/:branch_id', 
    checkExistOrNot,
    (req, res) => {
        branchService.deleteBranch(req.params.branch_id)
        .then(branch => { 
            res.status(200).json({"message": "branch deleted successfully", "branch": branch});
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