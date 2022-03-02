const { DataTypes } = require('sequelize');
 

module.exports = (sequelize) => {
    const Admin = sequelize.define('admin', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: true,
            unique: true
        }, 
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        }, 
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, 
    {
        freezeTableName: true,  
        createdAt: true,
        updatedAt: true,
    }); 
 

    return Admin;

} 
