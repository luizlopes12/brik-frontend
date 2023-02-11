const express = require('express')

const authRoutes = require('./authRoutes.js')
const divisionRoutes = require('./divisionRoutes.js')
const lotsRoutes = require('./lotRoutes.js')
const bannerRoutes = require('./bannerRoutes.js')
const taxRoutes = require('./taxRoutes.js')

const routes = (app) =>{
    app.use(
        authRoutes,
        divisionRoutes,
        lotsRoutes,
        bannerRoutes,
        taxRoutes
    )
}

module.exports = routes