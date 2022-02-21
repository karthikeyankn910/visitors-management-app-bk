const { Visitor } = require('../db_conn/db');

//create new visitor
module.exports.createVisitor = (visitor) => { 
    return Visitor.create({
        id: visitor.id,
        name: visitor.name,
        email: visitor.email,
        phone: visitor.phone,
        purpose: visitor.purpose, 
        designation: visitor.designation,
        organization: visitor.organization,
        city: visitor.city,
        check_in: visitor.check_in,
        check_out: visitor.check_out,
        other_info: visitor.other_info,
        branch_id: visitor.branch_id,
        emp_id: visitor.emp_id,
    }).then(visitor => {
        return visitor;
    }).catch(err => {
        return err;
    });
}

//get a visitor
module.exports.getAllVisitors = () => {
    return Visitor.findAll()
            .then(allVisitores => {
                return allVisitores;
            })
            .catch(err => {
                return err;
            });
}

//get visitor by id
module.exports.getVisitorById = (visitor_id) => {
    return Visitor.findOne({
        where: {
            id: visitor_id
        }
    }).then(visitor => {
        return visitor;
    }).catch(err => {
        return err;
    });
}

//update a visitor
module.exports.updateVisitor = (visitor) => {
    return Visitor.update(visitor, {
        where: {
            id: visitor.id
        },
        returning: true, 
        plain: true
    }).then(visitor => {
        return visitor;
    }).catch(err => {
        return err;
    })
}

//delete a visitor
module.exports.deleteVisitor = (visitor_id) => {
    return Visitor.findOne({
        where: {
            id: visitor_id
        }
    }).then(visitor => {
       visitor.destroy();
       return visitor;
    }).catch(err => {
        return err;
    });
}