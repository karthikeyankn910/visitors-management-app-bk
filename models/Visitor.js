const {DataTypes} = require('sequelize');
 

module.exports = (sequelize) => {
    const Tutorial = sequelize.define('visitor', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
        },
        purpose: {
            type: DataTypes.STRING,
        },
        phone: {
            type: DataTypes.STRING,
        },
        organization: {
            type: DataTypes.STRING,
        }, 
        designation: {
            type: DataTypes.STRING,
        },
        city: {
            type: DataTypes.STRING,
        }, 
        check_out: {
            type: DataTypes.DATE,
        },
        check_in: {
            type: DataTypes.DATE,
        },
        other_info: {
            type: DataTypes.JSONB,
        },
    }, 
    {
        freezeTableName: true,
        createdAt: true,
        updatedAt: true,
    }); 
 
 
    return Tutorial;

} 
