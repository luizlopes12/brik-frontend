const Sale = require('../Models/Sale')
const Lot = require('../Models/Lot')
const User = require('../Models/User')
const Division = require('../Models/Division')
const Partner = require('../Models/Partner')
const DivisionPartner = require('../Models/DivisionPartner')
const credentials = require('../config/gerencianet')
const Gerencianet = require('gn-api-sdk-node');
const Parcel = require('../Models/Parcel')
const LotImage = require('../Models/LotImage')
/*
regras:
    As parcelas anuais são criadas no momento da venda, são 12 no total
    As datas das parcelas anuais são definidas pelo cliente no momento da venda
    Todos os meses a data de vencimento vai ser o mesmo dia da data da primeira parcela
    Caso as parcelas sejam mais de 12, a partir da 13° parcela, o valor será o valor da parcela + valor acumulado do IGPM
    Ao listar as vendas, cada parcela deve ter o status verificado e atualizado
*/
class salesController {
    static async createParcels(quantity, saleData) {
        let salePriceWithTax;
        let parcelPrice;
        if(quantity <= 12){
            salePriceWithTax = (parseInt(saleData.salePrice) + ((saleData.salePrice * (saleData.fixedTaxPercetage / 100))))
            salePriceWithTax -= saleData.entryValue
            parcelPrice = Math.floor((salePriceWithTax / quantity) * 100)
        }
        else{
            // Adicionar lógica de corrigir com igpm a partir da 13° parcela
        }
        let saleDateYear = new Date(saleData.saleDate).getFullYear()
        let saleDateMonth = new Date(saleData.saleDate).getMonth() + 1 < 10 ? ((new Date(saleData.saleDate).getMonth() + 1).toString().padStart(2,'0')):(new Date(saleData.saleDate).getMonth() + 1)
        let saleDateDay = new Date(saleData.saleDate).getDate() + 1 < 10 ? ((new Date(saleData.saleDate).getDate() + 1).toString().padStart(2,'0')):(new Date(saleData.saleDate).getDate() + 1)
        let saleDateFormatted = `${saleDateYear}-${saleDateMonth}-${saleDateDay}`
        let options = {
          client_id: credentials.client_id,
          client_secret: credentials.client_secret,
          sandbox: true,
          pix_cert: credentials.pix_cert,
        };
        let gerencianet = new Gerencianet(options);
        // Cria as 12 paecelas anuais, com o valor da parcela e a data de vencimento
        // for(let i = 0; i < 12; i++){
            // saleDateMonth = parseInt(saleDateMonth) + 1
            // saleDateMonth = saleDateMonth < 10 ? ((saleDateMonth).toString().padStart(2,'0')):(saleDateMonth)
            // if(saleDateMonth > 12){
            //     saleDateMonth = '01'
            //     saleDateYear = parseInt(saleDateYear) + 1
            // }
            // saleDateFormatted = `${saleDateYear}-${saleDateMonth}-${saleDateDay}`
            var body = {
                payment: {
                  banking_billet: {
                    expire_at: saleDateFormatted, 
                    customer: {
                      name: saleData.users.name,
                      email: saleData.users.email,
                      cpf: saleData.users.CPF, 
                      phone_number: saleData.users.phone
                    }
                  }
                },
              
                items: [{
                  name: saleData.lotes.name + ' (parcela)',
                  value: parcelPrice,
                  amount: 1
                }],
                /* Parte onde são adicionados os juros */
                // shippings: [{
                //   name: 'Default Shipping Cost',
                //   value: 100
                // }]
              }
              try{
                let parcelCreated = await gerencianet.createOneStepCharge([], body).then(chargeRes=>chargeRes)
                if(parcelCreated){
                    let addParcelToDatabase = await Parcel.create({
                        saleId: saleData.id,
                        expireDate: parcelCreated.data.expire_at,
                        value: parcelCreated.data.total,
                        status: parcelCreated.data.status,
                        mulct: 0,
                        billetLink: parcelCreated.data.billet_link,
                        billetPdf: parcelCreated.data.pdf.charge,
                        chargeId: parcelCreated.data.charge_id
                    })
                    if(!addParcelToDatabase){
                        return false
                    }
                    return true
                }
              }catch(err){
                console.log(err)
                return false
              }
        // }
        
      }
    
    static createSaleAndTheirAnualParcels = async (req, res) => {
        const {
            saleDate, 
            salePrice, 
            commission, 
            fixedTaxPercetage, 
            variableTaxPercetage, 
            contract, 
            loteId, 
            buyerId,
            parcelsQuantity,
            entryValue
        } = req.body
        // commission = desconto(em porcentagem)
        let createdSale = await Sale.create({
            saleDate,
            salePrice,
            commission,
            fixedTaxPercetage,
            variableTaxPercetage,
            contract,
            loteId,
            buyerId,
            entryValue
        })
        if(!createdSale) {
            res.status(400).json({message: "Erro ao criar venda"})
        }else{
            await Sale.findByPk(createdSale.id, {
                include: [
                    {
                        model: Lot,
                        as: 'lotes',
                        required: false,
                        include: [{
                            model: LotImage,
                            as: 'loteImages',
                            required: false
                        },{
                            model: Partner,
                            as: 'lotePartners',
                            required: false
                        }
                    ]
                    },
                    {
                        model: User,
                        as: 'users',
                        required: false,
                    }
                ]
            }).then(async sale => {
                let saleParcels = await this.createParcels(parcelsQuantity, sale)
                if(saleParcels){
                    let saleCreatedData = await Sale.findByPk(createdSale.id, {
                        include: [
                            {
                                model: Parcel,
                                as: 'parcelas',
                                required: true,
                            },
                            {
                                model: Lot,
                                as: 'lotes',
                                required: false,
                                include: [{
                                    model: LotImage,
                                    as: 'loteImages',
                                    required: false
                                },{
                                    model: Partner,
                                    as: 'lotePartners',
                                    required: false
                                }
                            ]
                                    
        
                            },
                            {
                                model: User,
                                as: 'users',
                                required: false,
                            }
                        ]
                    })
                    if(saleCreatedData){
                        res.status(200).json({message: "Venda criada com sucesso!", data: saleCreatedData})
                    }else{
                        res.status(400).json({message: "Erro ao criar venda"})
                    }
                }else{
                    res.status(400).json({message: "Erro ao criar parcelas"})
                }
            }).catch(err => {
                console.log(err)
                res.status(500).json({message: "Erro no servidor"})
            })
        }
        


    }
    static listAllSales = async (req, res) => {

        let salesList = await Sale.findAll({
            include: [
                {
                    model: Parcel,
                    as: 'parcelas',
                    required: true,
                },
                {
                    model: Lot,
                    as: 'lotes',
                    required: false,
                    include: [{
                        model: LotImage,
                        as: 'loteImages',
                        required: false
                    },{
                        model: Partner,
                        as: 'lotePartners',
                        required: false
                    }
                ]
                },
                {
                    model: User,
                    as: 'users',
                    required: false,
                }
            ],
            order: [['createdAt', 'DESC']]
        })
        if(!salesList){
            res.status(500).json({message: 'Erro no servidor.'})
        }else{
            res.status(200).json(salesList)
        }
    }
}

module.exports = salesController

