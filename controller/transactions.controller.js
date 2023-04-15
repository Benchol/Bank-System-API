const Transactions = require('../model/transaction.model')

exports.listMyTransactions = async(req, res) => {
    const token = req.header('Authorization').split(' ')[1];
    const data = jwt.verify(token, env.token_secret);


    if (data) {
        const transaction_as_sender = await Transactions.findAll({ where: { sender_id: data.id } })
        const transaction_as_receiver = await Transactions.findAll({ where: { receiver_id: data_id } })

        const transactions = [transaction_as_receiver, transaction_as_sender];
    }
}