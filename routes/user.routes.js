const router = require('express').Router()
const userController = require('../controller/user.controller')

router.get('/test', userController.test)
router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/transfer', userController.transferMoney)
router.post('/withdraw', userController.withDrawMoney)

module.exports = router;