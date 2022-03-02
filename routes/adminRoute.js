const express = require('express');
const adminService = require('../services/adminService');
const { validate, ValidationError, Joi } = require('express-validation'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

 

//initializing router
const router = express.Router();





//schema to validate the request body and catching errors (refer last code block)
const registerValidation = {
    body: Joi.object({ 
        id: Joi.number().required(),
        name: Joi.string().required().min(3),
        email: Joi.string().email().required(), 
        password: Joi.string().min(3).max(16).required(),
    }), 
}

const loginValidation = {
    body: Joi.object({  
        email: Joi.string().email().required(), 
        password: Joi.string().min(3).max(16).required(),
    }), 
}



 
// checking for existance of the admin
var checkExistRegister = (req, res, next) => {    
    adminService.getAdminByEmail(req.body.email)
        .then(admin => {
            if (admin) {
                res.status(404).json({"message": "admin email already exists"});
                return;
            } 
            next(); 
            return; 
        }).catch(err => {
            res.status(400).json({"error": err});
        })
}
   
var checkExistLogin = (req, res, next) => {    
    adminService.getAdminByEmail(req.body.email)
        .then(admin => {
            if (admin) {
                req.admin = admin;
                next(); 
                return;
            } 
            res.status(404).json({"message": "invalid email id"});
            return;
        }).catch(err => {
            res.status(400).json({"error": err});
        })
}
 
// hasing the admin password
const hasingPassword = (req, res, next) => {
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            req.hashedPassword = hash;
            next();
        });
    });
}







/*
    END POINST STARTS...... HERE YOU GO.....
*/







// create a admin POST
router.post('/register', 
    validate(registerValidation, {}, {}),
    checkExistRegister,
    hasingPassword,
    (req, res) => { 
        adminService.createAdmin({
            id: req.body.id,
            name: req.body.name,
            email: req.body.email, 
            password: req.hashedPassword,
        }).then(admin => { 
            res.status(201).json({"message": "admin added succesfully", "Admin": admin});
        }).catch(err => {
            res.status(400).json({"error": err});
        });  
});


router.post('/login',
    validate(loginValidation, {}, {}),
    checkExistLogin,
    async (req, res) => {
        const validPass = await bcrypt.compare(req.body.password, req.admin.password);
        if (!validPass) {
            return res.status(400).json({"message": "invalid password"})
        }
        
        const token = jwt.sign({"id": req.body.id}, process.env.JWT_SECRET_KEY);
        res.header('auth-token', token).send(token);
        // res.status(200).json({"message": "logged in"});
})
 


 


router.use(function(err, req, res, next){
    if (err instanceof ValidationError) {
        return res.status(err.statusCode).json(err);
    }
    return res.status(500).json(err);
});



module.exports = router;