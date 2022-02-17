const {DataTypes} = require('sequelize');
 

module.exports = (sequelize) => {
    const Tutorial = sequelize.define('employee', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
        }, 
        phone: {
            type: DataTypes.STRING,
        }, 
        designation: {
            type: DataTypes.STRING,
        },
        city: {
            type: DataTypes.STRING,
        }, 
    }, 
    {
        freezeTableName: true,
        createdAt: true,
        updatedAt: true,
    }); 
 

    return Tutorial;

} 
