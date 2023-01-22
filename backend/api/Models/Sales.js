const db = require('../config/database.js')
const Lot = require('./Lot')
const Division = require('./Division')
const User = require('./User')

const Sales = db.connection.define('Vendas', {
    id: {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    lotId: {
        type: db.Sequelize.INTEGER,
        references: {
            model: 'lotes',
            key: 'id'
        }
    },
    buyerId: {
        type: db.Sequelize.INTEGER,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    saleDate: {
        type: db.Sequelize.DATE,
        allowNull: false
    },
    salePrice: {
        type: db.Sequelize.DECIMAL(10, 2),
        allowNull: false
    },
    commission: {
        type: db.Sequelize.DECIMAL(10, 2),
        allowNull: false
    },
    fixedTaxPercetage: {
        type: db.Sequelize.DECIMAL(10, 2),
        defaultValue: 1
    },
    variableTaxPercetage: {
        type: db.Sequelize.REAL,
        defaultValue: 1
    }
});

Sales.belongsTo(Lot, { as: 'lotes', foreignKey: 'loteId', hooks: true });
Sales.belongsTo(User, { as: 'users', foreignKey: 'buyerId', hooks: true });

// Sales.sync({ force: true })

module.exports = Sales

