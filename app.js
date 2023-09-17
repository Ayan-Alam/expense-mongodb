const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require("dotenv");

const userRouter = require('./Routes/userRouter');
const expenseRouter = require('./Routes/expenseRouter');
const PremiumRouter = require('./Routes/PremiumRouter');
const passwordRouter = require('./Routes/passwordRouter');

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(cors());
dotenv.config();

app.use('/login',userRouter);
app.use('/post',userRouter);

app.use('/expense',expenseRouter);
app.use('/premium',PremiumRouter);
app.use('/password',passwordRouter);

mongoose.connect(process.env.mongodb_client).then((result)=>{
    console.log("connected");
    app.listen(3000);
}).catch((err)=>{
    console.log(err);
})