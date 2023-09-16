const path = require('path');
const Razorpay = require("razorpay");
const Order = require("../models/OrderModel");
const userController = require("./userController");
const jwt = require('jsonwebtoken');
const expense = require('../models/expenseModel');
const { Op } = require("sequelize");

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
    rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
      if (err) {
        throw new Error(JSON.stringify(err));
      }
      req.user
        .createOrder({ orderid: order.id, status: "PENDING" })
        .then(() => {
          return res.status(201).json({ order, key_id: rzp.key_id });
        })
        .catch((err) => {
          throw new Error(err);
        });
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
    const order = await Order.findOne({ where: { orderid: order_id } });
    const promise1 = order.update({
      paymentid: payment_id,
      status: "SUCCESSFUL",
    });
    const promise2 = req.user.update({ ispremiumuser: true });

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
    const expenses = await expense.findAll({
      where: { date: date, userId: req.user.id },
    });
    return res.send(expenses);
  } catch (error) {
    console.log(error);
  }
};


exports.monthlyReports = async (req, res, next) => {
  try {
    const month = req.body.month;

    const expenses = await expense.findAll({
      where: {
        date: {
          [Op.like]: `%-${month}-%`,
        },
        userId: req.user.id,
      },
      raw: true,
    });

    return res.send(expenses);
  } catch (error) {
    console.log(error);
  }
};