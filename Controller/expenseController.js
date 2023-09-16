const path = require('path');
const user = require('../models/userModel');
const expense = require('../models/expenseModel');
const sequelize = require('../utils/database');

exports.gethomePage = (req,res,next) =>{
	res.sendFile(path.join(__dirname, '../', 'public', "views", 'homePage.html'));
}

exports.getExpense = async(req,res,next)=>{
	try {
		const expenses = await expense.findAll({ where: { userId: req.user.id } });
		res.json(expenses);
	  } catch (err) {
		console.log(err);
	  }
}

exports.getExpensePage = async (req,res,next)=>{
	try {
		const pageNo = req.params.page;
		const limit = 5;
		const offset = (pageNo - 1) * limit;
		const totalExpenses = await expense.count({
		  where: { userId: req.user.id },
		});
		const totalPages = Math.ceil(totalExpenses / limit);
		const expenses = await expense.findAll({
		  where: { userId: req.user.id },
		  offset: offset,
		  limit: limit,
		});
		res.json({ expenses: expenses, totalPages: totalPages });
	  } catch (err) {
		console.log(err);
	  }
}

exports.addExpense = async (req,res,next)=>{
	const t = await sequelize.transaction();
	try{
		const date = req.body.date;
		const amount = req.body.amount;
		const description = req.body.description;
		const category = req.body.category;
		await user.update(
			{
			  totalExpenses: req.user.totalExpenses + Number(amount),
			},
			{ where: { id: req.user.id } },
			{ transaction: t }
		  );
		await expense.create({
			date : date,
			amount : amount,
			description : description,
			category : category,
			userId : req.user.id,
		}).then((result) => {
			res.status(200);
			res.redirect('/expense/userDashboard');
		  })
		  .catch((err) => {
			console.log(err);
		  });
		  await t.commit(); 
	}catch(err){
		async (err) => {
			await t.rollback();
			console.log(err);
		  };
	}
	
}

exports.deleteExpense = async (req,res,next) => {
	try{
    const id = req.params.id;
    const expenses = await expense.findByPk(id);
    await user.update(
      {
        totalExpenses: req.user.totalExpenses - expenses.amount,
      },
      { where: { id: req.user.id } }
    );
   await expense.destroy({where: {id : id, userId: req.user.id}})
      res.sendStatus(200);
	}catch(err){
		console.log(err);
	}
  }