const express = require('express');
const visitorService = require('../services/visitorService');
const { validate, ValidationError, Joi } = require('express-validation'); 
const download = require('../export_logic/getData');
const { tempVisitors } = require('../temp_store/temporaryStore');
const Queue = require('bull');
const { client } = require('../redis_conn/redisConnection');

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
    let {city, purpose, organization, branch_id, emp_id } = req.query;

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
    const {visitor_id} = req.params; 
    visitorService.getVisitorById(visitor_id)
        .then(visitor => {
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
            tempVisitors.push(visitor);
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



const csvQueue = new Queue('csv-export', {
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});  

csvQueue.process(async (job, done) => {   
    try { 
        console.log("PROCESS");
        visitorService.getAllVisitors()
            .then(allVisitors => { 
                if (allVisitors) {
                    done(null, {status: false, result: allVisitors});
                } else {
                    done(null, {status: true, result: "Error occured"});
                }  
            })   
    }
    catch(err) {
        done(null, {status: true, result: err});
    }
}); 



// download visitor table as csv file
router.get('/download',  async (req, res) => {  
    console.log("DF")
    await csvQueue.add({name: "karthik"}, {});   
    csvQueue.on("completed", async (err, data) => {   
        console.log("DONE");
        await download(req, res, 'visitor', data.result);  
        res.end();
    });  
});
  



 

router.get('/recent', async (req, res) => {
    try { 
        let alreadyExists = await client.get('recent-visits' ); 
        if (alreadyExists) {
            console.log("From cache");
            res.json(JSON.parse(alreadyExists));
            return;
        } 
        await visitorService.getAllVisitors({
            attributes: ['id', 'name', 'purpose', 'organization'],
            limit: 3,
            order: [['createdAt', 'DESC']]
        }).then(async (recentVisitors) => {  
            client.setEx('recent-visits', 15, JSON.stringify(recentVisitors));
            console.log("From req");
            res.json(recentVisitors); 
        });
    } catch(err) {
        res.json({"error": err});
    }
})
 


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