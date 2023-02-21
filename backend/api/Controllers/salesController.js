const Sale = require('../Models/Sale')
const Lot = require('../Models/Lot')
const User = require('../Models/User')
const Partner = require('../Models/Partner')
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
        let salePrice;
        let anualValue;
        let entryValue;
        let parcelPrice;
        let anualTaxValue;
        console.log('Total: ' + quantity)
        if (quantity <= 12) {
            salePrice = parseInt(saleData.salePrice*100)
            entryValue = parseInt(saleData.entryValue*100)
            anualTaxValue = salePrice * (saleData.fixedTaxPercetage / 100)
            salePrice -= entryValue
            parcelPrice = salePrice / quantity
            anualValue = Math.round(parcelPrice * quantity)
        }
        else {
            salePrice = parseInt(saleData.salePrice*100)
            entryValue = parseInt(saleData.entryValue*100)
            anualTaxValue = salePrice * (saleData.fixedTaxPercetage / 100)
            salePrice -= entryValue
            parcelPrice = salePrice / quantity
            anualValue = Math.round(parcelPrice * 12)
            quantity = 12
            console.log("Anual: " + quantity)
            console.log("Preço total: "+salePrice)
            console.log("Preço anual: "+anualValue)
        }
        try {
            let saleDateYear = new Date(saleData.saleDate).getFullYear()
            let saleDateMonth = new Date(saleData.saleDate).getMonth() + 1 < 10 ? ((new Date(saleData.saleDate).getMonth() + 1).toString().padStart(2, '0')) : (new Date(saleData.saleDate).getMonth() + 1)
            let saleDateDay = new Date(saleData.saleDate).getDate() + 1 < 10 ? ((new Date(saleData.saleDate).getDate() + 1).toString().padStart(2, '0')) : (new Date(saleData.saleDate).getDate() + 1)
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
                items: [
                    {
                        name: saleData.lotes.name,
                        value: anualValue,
                        amount: 1
                    },
                    {
                        name: `Juros anuais(${saleData.fixedTaxPercetage}%)`,
                        value: anualTaxValue,
                        amount: 1
                    }

                ],
                customer: {
                    name: saleData.users.name,
                    email: saleData.users.email,
                    cpf: saleData.users.CPF,
                    phone_number: saleData.users.phone
                },
                expire_at: saleDateFormatted,
                // Porcentagem de acrescimo apos o vencimento
                // configurations: {
                //     fine: 200,
                //     interest: 33
                // },
                message: "Esta é uma parcela anual referente a compra do lote " + saleData.lotes.name,
                repeats: quantity,
                split_items: true,
                metadata: {
                    // Adicionar endpoint para o webhook onde vai atualizar o status da parcela
                    // notification_url: ''
                }
            }

            let parcelsCreated = await gerencianet.createCarnet({}, body).then(chargeRes => chargeRes)
            if (parcelsCreated) {
                const addParcelPromises = parcelsCreated.data.charges.map(async (parcelCreated) => {
                    const addParcelToDatabase = await Parcel.create({
                        saleId: saleData.id,
                        expireDate: parcelCreated.expire_at,
                        value: parcelCreated.value,
                        status: parcelCreated.status,
                        mulct: 0,
                        billetLink: parcelCreated.parcel_link,
                        billetPdf: parcelCreated.pdf.charge,
                        chargeId: parcelCreated.charge_id,
                    });
                    return addParcelToDatabase;
                });
                const addParcelResults = await Promise.all(addParcelPromises);
                // Check if all the promises resolved successfully
                const allPromisesResolved = addParcelResults.every((result) => result);
                if (allPromisesResolved) {
                    return true;
                } else {
                    return false;
                }
            }
        } catch (error) {
            console.log(error)
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
            entryValue,
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
            entryValue,
            parcelsQuantity
        })
        if (!createdSale) {
            res.status(400).json({ message: "Erro ao criar venda" })
        } else {
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
                        }, {
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
                if (saleParcels) {
                    let saleCreatedData = await Sale.findByPk(createdSale.id, {
                        include: [
                            {
                                model: Parcel,
                                as: 'parcelas',
                                required: false,
                            },
                            {
                                model: Lot,
                                as: 'lotes',
                                required: false,
                                include: [{
                                    model: LotImage,
                                    as: 'loteImages',
                                    required: false
                                }, {
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
                    if (saleCreatedData) {
                        res.status(200).json({ message: "Venda criada com sucesso!", data: saleCreatedData })
                    } else {
                        res.status(400).json({ message: "Erro ao criar venda" })
                    }
                } else {
                    console.log(saleParcels)
                    res.status(400).json({ message: "Erro ao criar parcelas" })
                }
            }).catch(err => {
                console.log(err)
                res.status(500).json({ message: "Erro no servidor" })
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
                    }, {
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
        if (!salesList) {
            res.status(500).json({ message: 'Erro no servidor.' })
        } else {
            res.status(200).json(salesList)
        }
    }
    static listSaleById = async (req, res) => {
        const { id } = req.params
        let sale = await Sale.findByPk(id, {
            include: [
                {
                    model: Parcel,
                    as: 'parcelas',
                    required: false,
                },
                {
                    model: Lot,
                    as: 'lotes',
                    required: false,
                    include: [{
                        model: LotImage,
                        as: 'loteImages',
                        required: false
                    }, {
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
        if (!sale) {
            res.status(500).json({ message: 'Erro no servidor.' })
        } else {
            res.status(200).json(sale)
        }
    }

    static testCron = async (req, res) => {
    }
}

module.exports = salesController

