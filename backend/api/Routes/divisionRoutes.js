
const express = require('express')
const divisionsController = require('../Controllers/divisionsController.js')
const router = express.Router()
const jwtAuth = require('../middlewares/jwtAuth.js')
// Remind: add jwt auth in all of these routes

router
.get('/divisions/list', divisionsController.listDivisionsAndTheirLots)
.get('/divisions/list/:id', divisionsController.listDivisionById)
.post('/divisions/add', divisionsController.addNewDivision)
.patch('/divisions/edit/:id', divisionsController.editExistingDivision)
.delete('/divisions/delete/:id', divisionsController.deleteDivision)

module.exports = router