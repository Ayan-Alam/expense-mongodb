const express = require('express');
const router =  express.Router();
const passwordController = require('../Controller/passwordController');

router.use(express.static("public"));

router.get('/forgotPassword',passwordController.getPassword);

router.post('/resetPassword',passwordController.resetPassword);

router.get("/resetPasswordPage/:requestId",passwordController.resetPasswordPage);

router.post('/sendMail',passwordController.sendMail);

module.exports = router;