const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('visitors_management', 'admin5', 'admin5', {
    host: 'localhost',
    dialect: 'postgres',
})


const db = {};

 
db.sequelize = sequelize;


module.exports = db;
