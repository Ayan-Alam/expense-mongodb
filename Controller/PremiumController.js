const path = require('path');
const Razorpay = require("razorpay");
const Order = require("../models/OrderModel");
const userController = require("./userController");
const jwt = require('jsonwebtoken');
const Expense = require('../models/expenseModel');


function generateAccessToken(id) {
	return jwt.sign({ userId: id },"secret-key");
  }

exports.purchasePremium = async (req, res) => {
  try {
    var rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const amount = 25000;
    rzp.orders.create({ amount, currency: "INR" },async (err, order) => {
      if (err) {
        throw new Error(JSON.stringify(err));
      }
      const userId = req.user.id;
      const newOrder = new Order({
        userId: userId,
        orderId: order.id,
        status: "PENDING",
      });
      await newOrder.save();
      return res.status(201).json({ order, key_id: rzp.key_id });
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Something went wrong", error: err });
  }
};

exports.updateTransactionStatus = async(req, res) => {
  try {
    const userId = req.user.id;
    const { payment_id, order_id } = req.body;
    console.log(order_id);
    const order = await Order.findOne({orderId: order_id});
    const promise1 = order.updateOne({
      paymentid: payment_id,
      status: "SUCCESSFUL",
    });
    const promise2 = req.user.updateOne({ isPremiumUser: true });

    Promise.all([promise1, promise2])
      .then(() => {
        return res.status(202).json({
          sucess: true,
          message: "Transaction Successful",
          token : generateAccessToken(userId, undefined, true),
        });
      })
      .catch((error) => {
        throw new Error(error);
      });
  } catch (err) {
    console.log(err);
    res.status(403).json({ error: err, message: "Something went wrong" });
  }
}

exports.getLeaderBoard = (req,res,next)=>{
  res.sendFile(path.join(__dirname, '../', 'public', "views", 'Leaderboard.html'))
}

exports.getReportPage = (req,res,next)=>{
  res.sendFile(path.join(__dirname, '../', 'public', "views", 'Report.html'))
}

exports.dailyReports = async (req, res, next) => {
  try {
    console.log(req.body);
    const date = req.body.date;
    const expenses = await Expense.find({ date: date, userId: req.user._id });
    return res.send(expenses);
  } catch (error) {
    console.log(error);
  }
};


exports.monthlyReports = async (req, res, next) => {
  try {
    const month = req.body.month;
    const userId = req.user._id;

    const expenses = await Expense.find({
      date: { $regex: `.*-${month}-.*` },
      userId: userId,
    });

    return res.send(expenses);
  } catch (error) {
    console.log(error);
  }
};