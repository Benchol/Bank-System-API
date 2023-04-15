const env = require('../env')
const { Sequelize } = require('sequelize')


module.exports = new Sequelize(env.DB, env.USER, env.PASSWORD, {
    host: env.HOST,
    dialect: env.dialect,
    // operatorsAliases: false,

    pool: {
        max: env.pool.max,
        min: env.pool.min,
        acquire: env.pool.acquire,
        idle: env.pool.idle
    }
})