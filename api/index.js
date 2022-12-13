const express = require('express')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const verifyJWT = require('./middlewares/verifyJWT')
const PORT = process.env.PORT || 3000

const app = express()
app.use(express.json())


app.get('/list', verifyJWT, (req, res) =>{
    res.status(200).json({id:req.userID})
})


app.post('/login', (req, res) => {
    if(req.body.email == 'luiz' && req.body.pass == '123'){
        let token = jwt.sign({id: req.body.id, email: req.body.email}, process.env.JWT_SECRET, {expiresIn: 60})
        res.status(200).json({message: 'Jogue na minha papai', token})
    }
    res.status(401).end()
})

app.listen(PORT, () =>{
    console.log('rodando papai, porta: ' + PORT)
})

