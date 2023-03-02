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


// Anotar em qual sequencia e quais tabelas devem ser criadas
// Banner, Division, DivisionPartner, Lot, LotImage, Notification, Parcel, Partner, Sale, User, TaxValues
const createDatabaseTables = async () => {
    await Banner.sync({});
    await Division.sync({});
    await DivisionPartner.sync({});
    await Lot.sync({});
    await LotImage.sync({});
    await Notification.sync({});
    await Parcel.sync({});
    await Partner.sync({});
    await Sale.sync({});
    await User.sync({});
    await TaxValues.sync({});
}


createDatabaseTables()