const { Sequelize, DataTypes } = require('sequelize');
const Visitor = require('../models/Visitor');
const Branch = require('./../models/Branch');
const Employee = require('./../models/Employee');
const Admin = require('./../models/Admin');
const dotenv = require('dotenv') 


dotenv.config();


//initialize sequelize to connect with db
const sequelize = new Sequelize(process.env.DB_SCHEMA, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: 4321,
    dialect: 'postgres',
})


const db = {};

 
db.sequelize = sequelize;
db.Visitor = Visitor(sequelize);
db.Branch = Branch(sequelize);
db.Employee = Employee(sequelize);
db.Admin = Admin(sequelize);



//one to many relation (branch -> visitor)
db.Branch.hasMany(db.Visitor, {
    foreignKey: {
        name: "branch_id",
        type: DataTypes.INTEGER,
    }
}); 
db.Visitor.belongsTo(db.Branch, {
    foreignKey: {
        name: "branch_id",
        type: DataTypes.INTEGER,
    } 
});


//one to many relation (branch -> employee)
db.Branch.hasMany(db.Employee, {
    foreignKey: {
        name: "branch_id",
        type: DataTypes.INTEGER,
    }
});
db.Employee.belongsTo(db.Branch, {
    foreignKey: {
        name: "branch_id",
        type: DataTypes.INTEGER,
    }
});


//one to many relation (employee -> visitor)
db.Employee.hasMany(db.Visitor, {
    foreignKey: {
        name: "emp_id", 
        type: DataTypes.INTEGER,
    }
});
db.Visitor.belongsTo(db.Employee, {
    foreignKey: {
        name: "emp_id", 
        type: DataTypes.INTEGER,
    }
});



module.exports = db;
