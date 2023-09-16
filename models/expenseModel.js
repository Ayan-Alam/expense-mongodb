const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const expense = sequelize.define('expense',{
    id:{
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true,
      },
    date: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    amount : Sequelize.INTEGER,
    description : {
        type : Sequelize.STRING,
    },
    category : Sequelize.STRING,
})

module.exports = expense;