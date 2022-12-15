const db = require('../config/database.js')

const User = db.connection.define('Users', {
    name: {
        type: db.Sequelize.STRING,
        required: true
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
    admin:{
        type: db.Sequelize.BOOLEAN,
        defaultValue: false
    }
})

module.exports = User

// User.sync({force: true})