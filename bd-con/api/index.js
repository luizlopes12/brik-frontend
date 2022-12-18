require('dotenv').config()
const db = require('./config/database')
const express = require('express') 
const cors = require('cors')
const PORT = process.env.PORT || 3000 

const app = express()
app.use(cors())
app.use(express.json())

app.listen(PORT, () =>{
    console.log(`Servidor rodando, porta ${PORT}`)
})
