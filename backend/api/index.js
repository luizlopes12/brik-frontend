require('dotenv').config()
const express = require('express')
const cors = require('cors')
const PORT = process.env.PORT || 3000
const routes = require('./Routes/index.js')

const app = express()
app.use(cors())
app.use(express.json())
routes(app)

app.get('/', (req, res) => res.json({message: 'inicio'}))

app.listen(PORT, () =>{
    console.log(`Servidor rodando, porta ${PORT}`)
})
