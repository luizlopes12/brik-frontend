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
    },
    // Permissions    
    editDivisions:{
        type: db.Sequelize.BOOLEAN,
        defaultValue: false
    },
    editLots:{
        type: db.Sequelize.BOOLEAN,
        defaultValue: false
    },
    editPartners:{
        type: db.Sequelize.BOOLEAN,
        defaultValue: false
    },
    editBanners:{
        type: db.Sequelize.BOOLEAN,
        defaultValue: false
    },
    editTaxes:{
        type: db.Sequelize.BOOLEAN,
        defaultValue: false
    },
})

module.exports = User

// User.sync({force: true})