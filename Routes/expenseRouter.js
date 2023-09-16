const express = require('express');
const router =  express.Router();
const expenseController = require("../Controller/expenseController");
const userAuthentication = require("../middleware/Auth");

router.use(express.static("public"));

router.get('/userDashboard',expenseController.gethomePage);

router.post('/addExpense', userAuthentication,expenseController.addExpense);

router.get('/getExpense/:page', userAuthentication,expenseController.getExpensePage);

router.get('/getExpense', userAuthentication,expenseController.getExpense);

router.delete('/deleteExpense/:id',userAuthentication,expenseController.deleteExpense);

module.exports = router;
