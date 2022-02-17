const {DataTypes} = require('sequelize');
 

module.exports = (sequelize) => {
    const Tutorial = sequelize.define('branch', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        name: {
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
