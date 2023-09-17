const path = require('path');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


function generateAccessToken(id) {
	return jwt.sign({ userId: id },"secret-key");
  }
  
exports.isPremium = async (req,res)=>{
	try {
	  if (req.user.isPremiumUser) {
		return res.json({ isPremiumUser: true });
	  }
	} catch (error) {
	  console.log(error);
	}
}

exports.getIndex = (req, res, next) => {
	res.sendFile(path.join(__dirname, '../', 'public', "views", 'index.html'));
}

exports.alluser = async(req,res,next)=>{
	try {
		User.find()
		  .select({ name: 1, totalExpenses: 1, _id: 0 })
		  .sort({ totalExpenses: -1 })
		  .then((users) => {
			const result = users.map((user) => ({
			  name: user.name,
			  totalExpenses: user.totalExpenses,
			}));
			res.send(JSON.stringify(result));
		  });
	  } catch (error) {
		console.log(error);
	  }
}

exports.getUser = async (req,res,next)=>{
	try{
		const email = req.body.loginEmail;
		const password = req.body.loginPassword;
		await User.findOne({email : email}).then((e)=>{
			if(e){
				bcrypt.compare(password,e.password,(err,result)=>{
					if(err){
						console.log(err);
					}
					if(result == true){
						return res.status(200).json({
							success: true,
							message: "Login Successful!",
							token: generateAccessToken(e.id),
						  })
						}else{
							return res.status(404).json({
								success: false,
								message: "Password is incorrect!",
							  });
					}
				})
			}else{
				return res.status(404).json({
					success: false,
					message: "User not Found!",
				  });
			}
		})
	}catch (err){
		console.log(err);
	}
}

exports.addUser = async (req, res, next) => {
	try {
		const name = req.body.name;
		const email = req.body.email;
		const password = req.body.password;
	
		await User.findOne({ email: email })
		  .then(async (user) => {
			if (user) {
			  res
				.status(409)
				.send(
				  `<script>alert('This email is already taken. Please choose another one.'); window.location.href='/login'</script>`
				);
			} else {
			   bcrypt.hash(password, 10,async (err,hash)=>{
				const newUser = new User({
					name: name,
					email: email,
					password: hash,
				  });
				  await newUser.save();
				})
			  res
				.status(200)
				.send(
				  `<script>alert('User Created Successfully!'); window.location.href='/login'</script>`
				);
			}
		  })
		  .catch((err) => console.log(err));
	  } catch (error) {
		console.log(error);
	  }
}




