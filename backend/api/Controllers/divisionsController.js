const User = require('../Models/User.js')
const Division = require('../Models/Division.js')
const Lot = require('../Models/Lot.js')
const LotImage = require('../Models/LotImage.js')
const Partner = require('../Models/Partner.js')

// to do: crud divisions, crud lots and updates in lot views and lotQuantity inside Division model

class divisionsController {
    static listDivisionsAndTheirLots = async(req, res) =>{
        let divisionsList = await Division.findAll({
            include: [{
              model: Lot,
              as: 'lotes',
              required: true
             }]
          })
        if(divisionsList){
            res.status(200).json(divisionsList)
        }else{
            res.status(400).json({message: "Ocorreu um erro na requisição, tente novamente."})
        }
    }
    static listDivisionById = async(req, res) =>{

    }
    static addNewDivision = async (req, res) =>{
        // Logo and blueprint will be a imgur url to the image
        let { name, logo, location, blueprint } = req.body
        let newDivision = await Division.create({
            name: name,
            logoUrl: logo,
            lotsQuantity: 0,
            location: location,
            bluePrint: blueprint,
        })
        if(newDivision){
            res.status(200).json({message: "Novo loteamento criado com sucesso.", data: newDivision})
        }else{
            res.status(400).json({message: "Ocorreu um erro na requisição, tente novamente."})
        }
    }

    static editExistingDivision = async (req, res) =>{
        // Logo and blueprint will be a imgur url to the image
        let id = parseInt(req.params.id)
        let {name, logo, location, blueprint } = req.body

        let updateDivision = await Division.update({
            name: name,
            logoUrl: logo,
            location: location,
            bluePrint: blueprint,
        },
        {
            where: { id: id }
        }
        )

        let updatedDivision = await Division.findByPk(id);

        if(updateDivision){
            res.status(200).json({message: "Loteamento atualizado com sucesso.", data: updatedDivision})
            console.log(updatedDivision)
        }else{
            res.status(400).json({message: "Ocorreu um erro na requisição, tente novamente."})
        }
    }
    static deleteDivision = async(req, res) =>{

    }
}
module.exports = divisionsController