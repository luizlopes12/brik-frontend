const db = require('../config/database');
const Banner = require('../models/Banner');
const Division = require('../models/Division');
const DivisionPartner = require('../models/DivisionPartner');
const Lot = require('../models/Lot');
const LotImage = require('../models/LotImage');
const Notification = require('../models/Notification');
const Parcel = require('../models/Parcel');
const Partner = require('../models/Partner');
const Sale = require('../models/Sale');
const User = require('../models/User');
const TaxValues = require('../models/TaxValues');


// const databaseKick = async () => {
//     try {
//         await db.connection.authenticate()
//         .then(() => {
//             db.connection.sync({ force: true })
//             .then(() => {
//                 console.log('Database & tables created!')
//             })
//         })
//     } catch (error) {
//         console.error('Erro no kick do BD: ', error);
//     }
// }

// const databaseDump = async () => {
//     try {
//         await db.connection.authenticate()
//         .then(async () => {
//             await User.create({
//                 name: 'Luiz Lopes',
//                 email: 'a@ahotmail.com',
//                 password: '123456',
//                 CPF: '11397313005',
//                 phone: '1234567891',
//                 admin: true,
//             })
//             await Division.create({
//                 name: "JARDIM ITAIQUARA",
//                 logo: "https://i.imgur.com/YQOzMWA.png",
//                 location: "Avenida Almeida Souza",
//                 blueprint: "https://i.imgur.com/YQOzMWA.png"
//              })
//             await Lot.create({
//                 name: 'TestBBBBe',
//                 location: 'AAAA',
//                 metrics: '25m',
//                 idLoteamento: 1
//             })
//         })
//     } catch (error) {
//         console.error('Erro no dump do BD: ', error);
//     }
// }


// databaseKick();
