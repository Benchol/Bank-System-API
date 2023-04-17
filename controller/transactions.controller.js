const jwt = require('jsonwebtoken')
const env = require('../env')
const Transactions = require('../model/transaction.model');
const User = require('../model/user.model');


exports.listMyTransactions = async(req, res) => {
    const token = req.header('Authorization').split(' ')[1];
    const data = jwt.verify(token, env.token_secret);


    if (data) {
        const transaction_as_sender = await Transactions.findAll({
            where: {
                sender_id: data.userId
            },
            include: [{
                model: User,
                as: 'senderId'
            }, {
                model: User,
                as: 'receiverId'
            }]
        })
        const transaction_as_receiver = await Transactions.findAll({
            where: {
                receiver_id: data.userId
            },
            include: [{
                model: User,
                as: 'senderId'
            }, {
                model: User,
                as: 'receiverId'
            }]
        })

        let transactions = transaction_as_receiver.concat(transaction_as_sender);

        transactions = transactions.filter((obj, index, self) =>
            index === self.findIndex((o) => o.id === obj.id)
        );

        const resultat = transactions.map((element) => {
            var { pin, createdAt, updatedAt, ...sender } = element.dataValues.senderId.dataValues;
            var { pin, createdAt, updatedAt, ...receiver } = element.dataValues.receiverId.dataValues;

            let temp = {
                id: element.dataValues.id,
                transaction_type: element.dataValues.transaction_type,
                transaction_date: element.dataValues.transaction_date,
                amount: element.dataValues.amount,
                sender: sender,
                receiver: receiver
            }
            return temp
        })

        res.status(200).json({
            status: true,
            message: 'Get all transaction success',
            transactions: resultat
        })
    } else {
        res.status(404).json({
            status: false,
            message: 'Token expired'
        })
    }

}