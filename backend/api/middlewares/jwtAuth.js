require('dotenv').config()
const jwt = require('jsonwebtoken')


const jwtAuth = (req, res, next) =>{
    let token = req.headers['x-access-token']
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) =>{
        if(err){
            return res.status(401).end()
        }
        req.userID = decoded.id
        next()
    })
}

module.exports = jwtAuth