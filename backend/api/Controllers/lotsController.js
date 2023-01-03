const User = require('../Models/User.js')
const Division = require('../Models/Division.js')
const Lot = require('../Models/Lot.js')
const LotImage = require('../Models/LotImage.js')
const Partner = require('../Models/Partner.js')

// to do: crud lots, list lots data with their partners, images and data about their division
class lotsController { 
    static addLot = async (req, res) =>{
        // to do: req lot data and add on database, to think about how relate the images and partners data to each lot
        let {
            name, 
            lotType, 
            location, 
            metrics, 
            basePrice,
            finalPrice,
            description,
            idLoteamento
        } = req.body

        try {
            let newLot = await Lot.create({
                name, 
                lotType, 
                location, 
                metrics, 
                basePrice,
                finalPrice,
                description,
                idLoteamento,
            })
            res.status(200).json({message: 'Lote criado com sucessso.', newLot})
        } catch (error) {
            res.status(403).json({message: 'Não foi possível adicionar o lote.'})
        }
    }
    static listLots = async (req, res) =>{
        
    }
    static listLotById = async (req, res) =>{

    }
    static updateLot = async (req, res) =>{
        
    }
    static deleteLot = async (req, res) =>{

    }
}

module.exports = lotsController