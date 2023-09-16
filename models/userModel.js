const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const user = sequelize.define('user',{
    id:{
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true,
      },
    name : Sequelize.STRING,
    email : {
        type : Sequelize.STRING,
        unique : true,
    },
    password : Sequelize.STRING,
    ispremiumuser : Sequelize.BOOLEAN,
    totalExpenses: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
})
module.exports = user;