const Sequelize = require('sequelize')
const db = require('../config/db.conf')


const Transaction = db.define('Transactions', {
    sender_id: {
        type: Sequelize.STRING
    },
    receiver_id: {
        type: Sequelize.STRING
    },
    transaction_type: {
        type: Sequelize.STRING
    },
    transaction_date: {
        type: Sequelize.STRING
    },
    amount: {
        type: Sequelize.FLOAT
    }
})

module.exports = Transaction;