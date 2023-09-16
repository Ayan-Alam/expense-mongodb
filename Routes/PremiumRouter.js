const express = require('express');
const router =  express.Router();
const premiumController = require("../Controller/PremiumController")
const userAuthentication = require("../middleware/Auth");

router.use(express.static("public"));

router.get('/premiumUser',userAuthentication,premiumController.purchasePremium);

router.post('/updateTransactionStatus',userAuthentication,premiumController.updateTransactionStatus);

router.get('/getLeaderBoardPage',premiumController.getLeaderBoard);

router.get('/getReport',premiumController.getReportPage);

router.post('/dailyReports',userAuthentication,premiumController.dailyReports);

router.post('/monthlyReports',userAuthentication,premiumController.monthlyReports);

module.exports = router;