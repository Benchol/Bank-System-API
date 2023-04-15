const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../model/user.model')
const env = require('../env')
const Transaction = require('../model/transaction.model')

exports.test = () => {
    console.log('Hello word');
}

exports.register = (req, res) => {
    console.log("type ", typeof(req.body.pin));
    bcrypt.hash(req.body.pin, 10, (err, hash) => {
        if (err) {
            console.error(err);
        } else {
            // Le hachage sécurisé est stocké dans la variable 'hash'
            console.log('Pass', hash, err);
            User.create({
                    id: Date.now(),
                    name: req.body.name,
                    username: req.body.username,
                    pin: hash,
                    role: req.body.role ? 'user' : req.body.role,
                    balance: req.body.balance,
                    updateAt: null,
                    createdAt: null
                })
                .then(() => {
                    console.log('Created ok')
                    res.status(200).json({
                        status: true,
                        message: "User registered !"
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        status: false,
                        message: "Error registration : " + err
                    })
                })
        }
    });

}

exports.login = (req, res) => {
    User.findOne({ where: { username: req.body.username } })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    status: false,
                    message: 'Username inexistant'
                })
            }
            console.log(typeof(req.body.pin), (user.dataValues.pin));
            bcrypt.compare(req.body.pin.toString(), user.dataValues.pin)
                .then(valid => {
                    console.log('valid ', valid);
                    if (!valid) {
                        return res.status(401).json({
                            status: false,
                            message: 'Password incorrect'
                        })
                    }

                    res.status(200).json({
                        status: true,
                        data: user,
                        token: jwt.sign({ userId: user.dataValues.id },
                            env.token_secret, { expiresIn: '24h' }
                        )
                    })
                })

        })
}

exports.withDrawMoney = (req, res) => {
    const token = req.header('Authorization').split(' ')[1];
    const data = jwt.verify(token, env.token_secret);
    const amountrRequested = req.body.amountRequested

    User.findOne({ where: { id: data.userId } })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    status: false,
                    message: 'token expired'
                })
            }

            bcrypt.compare(req.body.pin.toString(), user.dataValues.pin)
                .then(valid => {
                    console.log('valid ', valid);
                    if (!valid) {
                        return res.status(401).json({
                            status: false,
                            message: 'Password incorrect'
                        })
                    }

                    if (amountrRequested > user.dataValues.amount) {
                        return res.status(401).json({
                            status: false,
                            message: 'Found insufficient'
                        })
                    }

                    user.setDataValue('balance', user.getDataValue('balance') - amountrRequested);
                    user.save()
                        .then(() => {
                            Transaction.create({
                                    id: Date.now(),
                                    sender_id: user.getDataValue('id'),
                                    receiver_id: user.getDataValue('id'),
                                    transaction_type: 'withdraw',
                                    transaction_date: new Date().toString(),
                                    amount: parseFloat(amountrRequested),
                                    createdAt: null,
                                    updatedAt: null
                                })
                                .then(() => {
                                    console.log('Withdraw created');
                                    res.status(200).json({
                                        status: true,
                                        message: 'Fund withdraw success'
                                    })
                                })
                                .catch(err => {
                                    res.status(500).json({
                                        status: false,
                                        message: 'Withdraw error' + err
                                    })
                                })
                        })
                })
        })
}


exports.depositFund = (req, res) => {
    const token = req.header('Authorization').split(' ')[1];
    const data = jwt.verify(token, env.token_secret);
    const amount = req.body.amount

    User.findOne({ where: { id: data.userId } })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    status: false,
                    message: 'token expired'
                })
            }

            user.setDataValue('balance', parseFloat(user.getDataValue('balance')) + parseFloat(amount));
            user.save()
                .then(() => {
                    Transaction.create({
                            id: Date.now(),
                            sender_id: user.getDataValue('id'),
                            receiver_id: user.getDataValue('id'),
                            transaction_type: 'deposit',
                            transaction_date: new Date().toString(),
                            amount: parseFloat(amount),
                            createdAt: null,
                            updatedAt: null
                        })
                        .then(() => {
                            console.log('Deposit created');
                            res.status(200).json({
                                status: true,
                                message: 'Fund added success'
                            })
                        })
                        .catch(err => {
                            res.status(500).json({
                                status: false,
                                message: 'Deposit error' + err
                            })
                        })
                })
                .catch(err => {
                    res.status(500).json({
                        status: false,
                        message: 'Updated error ' + err
                    })
                })
        })
        .catch(err => {
            res.status(404).json({
                status: false,
                message: 'User not found' + err
            })
        })
}

exports.transferMoney = (req, res) => {
    const token = req.header('Authorization').split(' ')[1];
    const data = jwt.verify(token, env.token_secret);
    const amount = req.body.amount

    User.findOne({ where: { id: data.userId } })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    status: false,
                    message: 'token expired'
                })
            }
            if (amount > user.dataValues.amount) {
                return res.status(401).json({
                    status: false,
                    message: 'Found insufficient'
                })
            }

            User.findOne({ where: { id: req.body.receiver_id } })
                .then((receiver) => {
                    if (!receiver) {
                        return res.status(401).json({
                            status: false,
                            message: 'User receiver not found'
                        })
                    }
                    receiver.setDataValue('balance', receiver.getDataValue('balance') + amount);
                    receiver.save()
                        .then(() => {
                            Transaction.create({
                                    id: Date.now(),
                                    sender_id: user.getDataValue('id'),
                                    receiver_id: receiver.getDataValue('id'),
                                    transaction_type: 'transfer',
                                    transaction_date: new Date().toString(),
                                    amount: parseFloat(amount),
                                    createdAt: null,
                                    updatedAt: null
                                })
                                .then(() => {
                                    console.log('Transaction created');
                                    res.status(200).json({
                                        status: true,
                                        message: 'Transaction successful'
                                    })
                                })
                                .catch(err => {
                                    res.status(500).json({
                                        status: false,
                                        message: 'Transaction error' + err
                                    })
                                })
                        })
                        .catch(err => {
                            res.status(500).json({
                                status: false,
                                message: 'Transaction error' + err
                            })
                        })
                })
                .catch(err => {
                    res.status(404).json({
                        status: false,
                        message: 'user not found' + err
                    })
                })
        })
        .catch(err => {
            res.status(404).json({
                status: false,
                message: 'user not found' + err
            })
        })
}