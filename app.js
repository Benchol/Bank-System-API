const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const db = require('./config/db.conf')
const accountRouter = require('./routes/user.routes')
const transactionRouter = require('./routes/transactions.routes')

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

db.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(error => {
        console.error('Unable to connect to the database:', error);
    })

app.use('/api/', accountRouter)
app.use('/api/transaction', transactionRouter)

module.exports = app;