const db = require('../config/database.js')
const Division = require('./Division')

const Lot = db.connection.define('Lots', {
    name: {
        type: db.Sequelize.STRING,
        required: true
    },
    lotType: {
        type: db.Sequelize.STRING,
        required: false,
        defaultValue: 'Urbano',
    },
    location: {
        type: db.Sequelize.STRING,
        required: true,
    },
    metrics: {
        type: db.Sequelize.STRING,
        required: true,
    },
    basePrice: {
        type: db.Sequelize.REAL,
        required: false,
    },
    finalPrice: {
        type: db.Sequelize.STRING,
        required: false,
    },
    description: {
        type: db.Sequelize.STRING,
        required: false,
    },
    isAvaible:{
        type: db.Sequelize.BOOLEAN,
        required: false,
        defaultValue: true,
    },
    userViews: {
        type: db.Sequelize.INTEGER,
        defaultValue: 0,
    }
})

Lot.belongsTo(Division, {
    constraint: true,
    foreignKey: 'idLoteamento'
})

module.exports = Lot

// Lot.sync({force: true})

// Lot.create({
//     name: 'Teste',
//     location: 'AAAA',
//     metrics: '25m',
//     idLoteamento: 1
// })