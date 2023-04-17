const { Sequelize, DataTypes } = require('sequelize')
const db = require('../config/db.conf');
const User = require('./user.model');


const Transaction = db.define('Transactions', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        autoIncrement: true
    },
    sender_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: User, // Faire référence au modèle User
            key: 'id' // Utiliser la clé primaire 'id' de User comme clé étrangère
        }
    },
    receiver_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: User, // Faire référence au modèle User
            key: 'id' // Utiliser la clé primaire 'id' de User comme clé étrangère
        }
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
});





module.exports = Transaction;