const path = require('path');
const Sib = require('sib-api-v3-sdk');
const ResetPassword = require('../models/passwordModel');
const user = require('../models/userModel');
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const saltRounds = 10;

const hashPassword = async (password) => {
	return await bcrypt.hash(password, saltRounds);
  };

exports.resetPasswordPage = async (req, res, next) => {
	try {
	  res
		.status(200)
		.sendFile(
		  path.join(__dirname, "../", "public", "views", "resetPassword.html")
		);
	} catch (error) {
	  console.log(error);
	}
  };

exports.getPassword = (req,res,next)=>{
	res.sendFile(path.join(__dirname, '../', 'public', "views", 'ForgotPassword.html'));
}

exports.sendMail = async(req,res,next)=>{
	try {
		const email = req.body.email;
		const requestId = uuidv4();
	
		const recepientEmail = await user.findOne({ where: { email: email } });
	
		if (!recepientEmail) {
		  return res
			.status(404)
			.json({ message: "Please provide the registered email!" });
		}
	
		const resetRequest = await ResetPassword.create({
		  id: requestId,
		  isActive: true,
		  userId: recepientEmail.dataValues.id,
		});
	
		const client = Sib.ApiClient.instance;
		const apiKey = client.authentications["api-key"];
		apiKey.apiKey = process.env.API_KEY;
		const transEmailApi = new Sib.TransactionalEmailsApi();
		const sender = {
		  email: "ayanalam186@gmail.com",
		  name: "ayan",
		};
		const receivers = [
		  {
			email: email,
		  },
		];
		const emailResponse = await transEmailApi.sendTransacEmail({
		  sender,
		  To: receivers,
		  subject: "Reset Password",
		  textContent: "Link Below",
		  htmlContent: `<h3>This message is to confirm that a request to change your password has been initiated on your account. If you did not initiate this request, please disregard this email.</h3>
		  <a href="http://localhost:3000/password/resetPasswordPage/{{params.requestId}}"> Click Here</a>`,
		  params: {
			requestId: requestId,
		  },
		});
		return res.status(200).json({
		  message:
			"Link for reset the password is successfully send on your Mail Id!",
		});
	  } catch (error) {
		console.log("error");
		return res.status(409).json({ message: "failed changing password" });
	  }	
}

exports.resetPassword = async(req,res,next)=>{
	try {
		const requestId = req.headers.referer.split("/");
		const password = req.body.password;
		const checkResetRequest = await ResetPassword.findAll({
		  where: { id: requestId[requestId.length - 1], isActive: true },
		});
		if (checkResetRequest[0]) {
		  const userId = checkResetRequest[0].dataValues.userId;
		  const result = await ResetPassword.update(
			{ isActive: false },
			{ where: { id: requestId } }
		  );
		  const newPassword = await hashPassword(password);
		  const users = await user.update(
			{ password: newPassword },
			{ where: { id: userId } }
		  );
		  return res
			.status(200)
			.json({ message: "Successfully changed password!" });
		} else {
		  return res
			.status(409)
			.json({ message: "Link is already Used Once, Request for new Link!" });
		}
	  } catch (err) {
		console.log(err);
		return res.status(409).json({ message: "Failed to change password!" });
	  }
}