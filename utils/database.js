const Sequelize = require('sequelize');

const sequelize = new Sequelize('expense-ease','root','Kia@123',{
    dialect:'mysql',
    host:'localhost'
});

module.exports = sequelize;