const db = require('../config/database.js')

const Banner = db.connection.define('Banners', {
    name: {
        type: db.Sequelize.STRING,
        required: true
    },
    link: {
        type: db.Sequelize.STRING,
        required: false,
    },
    imageUrl: {
        type: db.Sequelize.STRING,
        required: true,
    },
    initDate: {
        type: db.Sequelize.DATE,
    },
    expireDate: {
        type: db.Sequelize.DATE,
    }
})


module.exports = Banner

// Banner.sync({force: true});

// Division.create({
//     name: 'Teste',
//     location: 'AAAA',
// })