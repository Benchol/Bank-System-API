module.exports = {
    HOST: 'localhost',
    USER: 'dev',
    PASSWORD: '123456',
    DB: 'banksystem',
    dialect: 'postgres',
    // define: {
    //     timestamps: false
    // },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    token_secret: 'BANK_TEST_TOKEN'
};