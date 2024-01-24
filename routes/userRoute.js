const express = require("express");
const router = express.Router();
const chapterController = require('../controller/userController/chapterController')
const userController = require("../controller/userController/userController");
const orderController = require("../controller/userController/orderController")
const multer = require('../config/multer')
const upload = multer.createMulter()
const {verifyToken } = require('../middleware/userAuth') 

router.post("/login", userController.login);
router.post("/signup", userController.signup);

router.post('/phonepay/payment',orderController.phonePayPayment)
router.post('/phonepay/status',orderController.phonePayStatus)

router.use(verifyToken)
router.route('/course')
      .get(chapterController.fetchChapters)
      
      
router.route('/order')
      .post(upload.fields([{ name: 'screenshot' }]),orderController.localBankOrder)

module.exports = router;
