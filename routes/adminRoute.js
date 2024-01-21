const express = require("express")
const router = express.Router()
const adminController = require('../controller/adminController/adminController')

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
    
module.exports = router