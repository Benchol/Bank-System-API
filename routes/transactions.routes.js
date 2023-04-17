const router = require('express').Router()
const transactionController = require('../controller/transactions.controller')

router.get('/getMyTransaction', transactionController.listMyTransactions)

module.exports = router;