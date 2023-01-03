const express = require('express')

const authRoutes = require('./authRoutes.js')
const divisionRoutes = require('./divisionRoutes.js')
const lotsRoutes = require('./lotRoutes')

const routes = (app) =>{
    app.use(
        authRoutes,
        divisionRoutes,
        lotsRoutes
    )
}

module.exports = routes