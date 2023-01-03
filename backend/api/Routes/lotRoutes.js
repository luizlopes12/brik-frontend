
const express = require('express')
const lotImagesController = require('../Controllers/lotImagesController.js')
const lotsController = require('../Controllers/lotsController.js')
const router = express.Router()
const jwtAuth = require('../middlewares/jwtAuth.js')
// Remind: add jwt auth in all of these routes

router
.get('/lots/list', lotsController.listLots)
.get('/lots/:id', lotsController.listLotById)
.post('/lots/:id/images/add', lotImagesController.addImage)
.delete('/lots/images/delete/:id', lotImagesController.deleteImage)

module.exports = router