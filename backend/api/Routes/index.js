const express = require('express')

const authRoutes = require('./authRoutes.js')
const divisionRoutes = require('./divisionRoutes.js')

const routes = (app) =>{
    app.use(
        authRoutes,
        divisionRoutes
    )
}

module.exports = routes