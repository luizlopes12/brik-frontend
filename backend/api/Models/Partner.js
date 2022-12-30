const db = require('../config/database.js')
const Lot = require('./Lot')

const Partner = db.connection.define('Partners', {
    name: {
        type: db.Sequelize.STRING,
        required: true,
    },
    CPF: {
        type: db.Sequelize.STRING,
        required: true,
    },
    percentage: {
        type: db.Sequelize.REAL,
        required: true,
    },
})

Partner.belongsTo(Lot, {
    constraint: true,
    foreignKey: 'idLote'
})

module.exports = Partner

// Partner.sync({force: true})

// Partner.create({
//     name: 'Luiz',
//     CPF: '444444444444',
//     percentage: 5.5,
//     idLot: 1
// })