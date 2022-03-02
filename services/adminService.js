const { Admin } = require('../db_conn/db');



module.exports.createAdmin = (admin) => { 
    return Admin.create({
        id: admin.id,
        name: admin.name,
        email: admin.email, 
        password: admin.password
    }).then(admin => {
        return admin;
    }).catch(err => {
        return err;
    });
}
 

module.exports.getAdminByEmail = (emailid) => {  
    return Admin.findOne({
        where: {
            email: emailid
        }
    }).then(admin => {
        return admin;
    }).catch(err => {
        return err;
    }) ;
}