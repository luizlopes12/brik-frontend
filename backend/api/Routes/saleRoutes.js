
const express = require('express')
const salesController = require('../Controllers/salesController.js')

const router = express.Router()
const jwtAuth = require('../middlewares/jwtAuth.js')
// Remind: add jwt auth in all of these routes

router
.get('/sales/list', salesController.listAllSales)
.post('/sales/create', salesController.createSaleAndTheirAnualParcels)

module.exports = router