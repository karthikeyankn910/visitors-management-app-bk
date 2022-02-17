const { Sequelize, DataTypes } = require('sequelize');
const Visitor = require('../models/Visitor');
const Branch = require('./../models/Branch');
const Employee = require('./../models/Employee');

const sequelize = new Sequelize('visitors_management', 'admin5', 'admin5', {
    host: 'localhost',
    dialect: 'postgres',
})


const db = {};

 
db.sequelize = sequelize;
db.Visitor = Visitor(sequelize);
db.Branch = Branch(sequelize);
db.Employee = Employee(sequelize);

db.Branch.hasMany(db.Visitor);
db.Visitor.belongsTo(db.Branch, {
    foreignKey: {
        name: "branch_id",
        type: DataTypes.INTEGER,
    }
});

db.Branch.hasMany(db.Employee);
db.Employee.belongsTo(db.Branch, {
    foreignKey: {
        name: "branch_id",
        type: DataTypes.INTEGER,
    }
});

db.Employee.hasMany(db.Visitor);
db.Visitor.belongsTo(db.Employee, {
    foreignKey: {
        name: "emp_id",
        type: DataTypes.INTEGER,
    }
});



module.exports = db;
