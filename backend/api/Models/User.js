const db = require('../config/database.js')

const User = db.connection.define('Users', {
    profileImage: {
        type: db.Sequelize.STRING,
        required: false,
        defaultValue: 'https://i.imgur.com/cwVOOqb.jpg'
    },
    name: {
        type: db.Sequelize.STRING,
        required: true
    },
    CPF: {
        type: db.Sequelize.STRING,
        required: false,
    },
    email: {
        type: db.Sequelize.STRING,
        required: true,
    },
    phone: {
        type: db.Sequelize.STRING,
        required: false,
    },
    password: {
        type: db.Sequelize.STRING,
        required: true,
    },
    admin: {
        type: db.Sequelize.BOOLEAN,
        defaultValue: false
    },
    // Permissions    
    editDivisions: {
        type: db.Sequelize.BOOLEAN,
        defaultValue: false
    },
    editLots: {
        type: db.Sequelize.BOOLEAN,
        defaultValue: false
    },
    editPartners: {
        type: db.Sequelize.BOOLEAN,
        defaultValue: false
    },
    editBanners: {
        type: db.Sequelize.BOOLEAN,
        defaultValue: false
    },
    editTaxes: {
        type: db.Sequelize.BOOLEAN,
        defaultValue: false
    },
})



// User.sync({force: true})

// User.create({
//     name: 'Luiz Lopes',
//     email: 'a@ahotmail.com',
//     password: '123456',
//     CPF: '11397313005',
//     phone: '1234567891',
//     admin: true,
// })

module.exports = User
