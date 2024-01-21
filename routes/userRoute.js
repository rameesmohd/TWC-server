const express = require("express");
const router = express.Router();
const userController = require("../controller/userController/userController");

router.post("/login", userController.login);
router.post("/signup", userController.signup);

router.route('/course')
      .get(userController.fetchChapters)

module.exports = router;
