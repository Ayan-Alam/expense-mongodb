const path = require('path');
const User = require('../models/userModel');
const Expense = require('../models/expenseModel');
const mongoose = require("mongoose");

exports.gethomePage = (req,res,next) =>{
	res.sendFile(path.join(__dirname, '../', 'public', "views", 'homePage.html'));
}

exports.getExpense = async(req,res,next)=>{
	try {
		const expenses = await Expense.find({userId: req.user.id});
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
		const totalExpenses = await Expense.countDocuments({ userId: req.user.id });
		const totalPages = Math.ceil(totalExpenses / limit);
		const expenses = await Expense.find({ userId: req.user.id })
		.skip(offset)
		.limit(limit);
		res.json({ expenses: expenses, totalPages: totalPages });
	  } catch (err) {
		console.log(err);
	  }
}

exports.addExpense = async (req,res,next)=>{
	const session = await mongoose.startSession();
	session.startTransaction();
	try{
		const date = req.body.date;
		const amount = req.body.amount;
		const description = req.body.description;
		const category = req.body.category;
		const user = await User.findById(req.user.id);
        user.totalExpenses += Number(amount);
        await user.save({ session });

       const expense = new Expense({
         date: date,
         category: category,
         description: description,
         amount: amount,
         userId: req.user._id,
           });
    await expense.save({ session });
    await session.commitTransaction();
	res.redirect('/expense/userDashboard');
    } catch (err) {
    await session.abortTransaction();
    console.log(err);
    } finally {
    session.endSession();
    }
		/*await user.update(
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
		  await t.commit(); */
}

exports.deleteExpense = async (req,res,next) => {
	try {
	  const id = req.params.id;
	  const expense = await Expense.findOne({ _id: id, userId: req.user.id });
	  const user = await User.findById(req.user.id);
	  user.totalExpenses -= expense.amount;
	  await user.save();
	  await Expense.deleteOne({ _id: id, userId: req.user.id });
	  res.redirect("/homePage");
	} catch (err) {
	  console.log(err);
	}
  }