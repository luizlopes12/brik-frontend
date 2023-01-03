
const express = require('express')
const lotsController = require('../Controllers/lotsController.js')
const router = express.Router()
const jwtAuth = require('../middlewares/jwtAuth.js')
// Remind: add jwt auth in all of these routes

router
.get('/lots/list', lotsController.listLots)

module.exports = router