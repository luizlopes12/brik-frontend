const db = require('../config/database.js')
const Lot = require('./Lot')

const LotImage = db.connection.define('LotImages', {
    imageUrl: {
        type: db.Sequelize.STRING,
        required: true,
    }
})

LotImage.belongsTo(Lot, {
    constraint: true,
    foreignKey: 'idLot'
})

module.exports = LotImage

// LotImage.sync({force: true})

// LotImage.create({
//     imageUrl: 'AAA',
//     idLot: 1
// })