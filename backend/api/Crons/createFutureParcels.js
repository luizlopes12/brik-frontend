const cron = require('node-cron');
const Sale = require('../Models/Sale')
const Lot = require('../Models/Lot')
const User = require('../Models/User')
const Partner = require('../Models/Partner')
const credentials = require('../config/gerencianet')
const Gerencianet = require('gn-api-sdk-node');
const Parcel = require('../Models/Parcel')
const LotImage = require('../Models/LotImage')
const gerencianet = new Gerencianet(credentials);

// Path: backend\api\crons\createNewParcels.js
// 0 0 1 * * - Run at 00:00:00 on day-of-month 1.
/*
    check if is the last parcel of the year and if it is, create new parcels for the next year,
    with the tax percentage of igpm and notify the admin
*/

module.exports = cron.schedule('0 0 1 * *', async () => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        let lastParcel;
        // Find all sales that have a last parcel with a matching year and month
        const salesToUpdate = await Sale.findAll({
            where: { id: 129 },
            include: [
                {
                    model: Parcel,
                    as: 'parcelas',
                    required: true,
                }
            ],
        });
        salesToUpdate.forEach(async (sale) => {
            lastParcel = sale.parcelas.reduce((prev, current) => {
                if (prev.expireDate > current.expireDate) {
                    return prev;
                }
                return current;
            });
            let lastParcelDate = new Date(lastParcel.expireDate);
            if(((lastParcelDate.getFullYear()) === currentYear) && ((lastParcelDate.getMonth() + 1) === currentMonth)){
                // To do: create future parcels based on IGPM as tax percentage and notify the admin
                
            }
        })
});
