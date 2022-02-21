const {DataTypes} = require('sequelize');
 

module.exports = (sequelize) => {
    const Tutorial = sequelize.define('branch', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
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
