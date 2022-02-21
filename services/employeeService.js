const { Employee } = require('../db_conn/db');

//create new employee
module.exports.createEmployee = (employee) => { 
    return Employee.create({
        id: employee.id,
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        designation: employee.designation,
        city: employee.city,
        branch_id: employee.branch_id,
    }).then(employee => {
        return employee;
    }).catch(err => {
        return err;
    });
}

//get a employee
module.exports.getAllEmployees = () => {
    return Employee.findAll()
            .then(allEmployeees => {
                return allEmployeees;
            })
            .catch(err => {
                return err;
            });
}

//get employee by id
module.exports.getEmployeeById = (employee_id) => {
    return Employee.findOne({
        where: {
            id: employee_id
        }
    }).then(employee => {
        return employee;
    }).catch(err => {
        return err;
    });
}

//update a employee
module.exports.updateEmployee = (employee) => {
    return Employee.update(employee, {
        where: {
            id: employee.id
        },
        returning: true, 
        plain: true
    }).then(employee => {
        return employee;
    }).catch(err => {
        return err;
    })
}

//delete a employee
module.exports.deleteEmployee = (employee_id) => {
    return Employee.findOne({
        where: {
            id: employee_id
        }
    }).then(employee => {
       employee.destroy();
       return employee;
    }).catch(err => {
        return err;
    });
}