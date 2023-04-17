const Sequelize = require('sequelize')
const db = require('../config/db.conf');
const Transaction = require('./transaction.model');

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
});

// User.hasMany(Transaction, { as: 'senderId', foreignKey: 'sender_id' });
// User.hasMany(Transaction, { as: 'receiverId', foreignKey: 'receiver_id' });

// User.hasMany(Transaction, { foreignKey: 'id' });
Transaction.belongsTo(User, { foreignKey: 'sender_id', as: "senderId" });
Transaction.belongsTo(User, { foreignKey: 'receiver_id', as: "receiverId" });
module.exports = User;