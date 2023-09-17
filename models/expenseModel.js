const mongoose = require('mongoose');

const expense =  new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },amount: {
    type: Number,
    required: true,
  },description: {
    type: String,
    required: true,
  },category: {
    type: String,
    required: true,
  },userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Expense = mongoose.model("Expense", expense);

module.exports = Expense;


/*const Sequelize = require('sequelize');

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

module.exports = expense; */