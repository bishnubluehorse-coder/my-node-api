const sequelize = require('../config/db');
const {DataTypes} = require('sequelize');

const UserModel = sequelize.define(
    'users',
    {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        image:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        originalImageName:{
            type: DataTypes.STRING,
            allowNull: true,
        },
    }
)

module.exports = UserModel;