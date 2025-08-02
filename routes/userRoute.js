const express = require("express");
const router = express.Router();
const chapterController = require('../controller/userController/chapterController')
const userController = require("../controller/userController/userController");
const orderController = require("../controller/userController/orderController")
const generateCertificater = require('../controller/certificateGenerator/certificateController')
const multer = require('../config/multer')
const upload = multer.createMulter()
const {verifyToken } = require('../middleware/userAuth') 

router.post("/login", userController.login);

router.route("/signup")
      .post(userController.signup)

router.post("/send-otp",userController.sendOtp)

router.route("/forget-password")
      .post(userController.sendResetMail)
      .patch(userController.resetNewPassword)

router.post('/phonepay/payment',orderController.phonePayPayment)
router.post('/phonepay/status',orderController.phonePayStatus)


router.use(verifyToken)

router.patch('/logout',userController.logoutUser)

router.get('/generatecertificate',generateCertificater.generateCertificate)
router.get('/transaction',orderController.fetchTrasactionData)

router.route('/course')
      .get(chapterController.fetchChapters)
      .patch(chapterController.handleChapterCompletes)
      
router.route('/order')
      .post(upload.fields([{ name: 'screenshot' }]),orderController.localBankOrder)
      .put(upload.fields([{ name: 'screenshot' }]),orderController.usdtOrder)

module.exports = router;
