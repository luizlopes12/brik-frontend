const express = require('express')

const authRoutes = require('./authRoutes.js')

const routes = (app) =>{
    app.use(
        authRoutes
    )
}

module.exports = routes