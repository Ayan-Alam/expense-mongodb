const express = require('express');
const router =  express.Router();
const userController = require("../Controller/userController");
const userAuthentication = require("../middleware/Auth");

router.use(express.static("public"));

router.get('/',userController.getIndex);

router.post('/user',userController.addUser);

router.post('/getuser',userController.getUser);

router.get('/alluser',userController.alluser);

router.get('/ispremiumUser',userAuthentication,userController.isPremium);

module.exports = router;