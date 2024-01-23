const express = require("express");
const router = express.Router();
const userController = require("../controller/userController/userController");
const orderController = require("../controller/userController/orderController")
const multer = require('../config/multer')
const upload = multer.createMulter()
const {verifyToken } = require('../middleware/userAuth') 

router.post("/login", userController.login);
router.post("/signup", userController.signup);

router.use(verifyToken)
router.route('/course')
      .get(userController.fetchChapters)
router.route('/order')
      .post(upload.fields([{ name: 'screenshot' }]),orderController.localBankOrder)
      
module.exports = router;
