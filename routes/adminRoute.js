const express = require("express")
const router = express.Router()
const adminController = require('../controller/adminController/adminController')
const orderController = require('../controller/adminController/orderController')

router.post('/login',adminController.login);
router.route('/users')
    .get(adminController.fetchUsers)
    .patch(adminController.blockToggle)
router.route('/chapter')
    .get(adminController.fetchChapters)    
    .post(adminController.addChapter)
    .patch(adminController.editChapter)
    .delete(adminController.deleteChapter)
router.route('/lesson')
    .post(adminController.addLesson)
    .delete(adminController.deleteLesson)
router.route('/order')
    .get(orderController.fetchOrder)
    .patch(orderController.handleOrder)

module.exports = router