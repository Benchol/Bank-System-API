const Sequelize = require('sequelize')
const db = require('../config/db.conf')

const User = db.define('User', {
    name: {
        type: Sequelize.STRING
    },
    username: {
        type: Sequelize.STRING
    },
    pin: {
        type: Sequelize.STRING
    },
    balance: {
        type: Sequelize.FLOAT
    },
    role: {
        type: Sequelize.STRING
    }
})

module.exports = User;