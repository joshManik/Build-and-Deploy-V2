'use strict'
const crypto = require('crypto');

const jwt = require('jsonwebtoken');

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET

exports.SaltPassword = function(password){
    const salt = crypto.randomBytes(16).toString('base64');
    console.log(salt, salt.length)
    var hash = crypto.createHmac('sha512', salt)
    hash.update(password);
    var value = hash.digest('hex');
    return (salt + value)
}

exports.AuthenticateToken = function(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, JWT_SECRET, (err, user) => {
        console.log(err)
        if (err) return res.sendStatus(403)
        console.log(user)
        req.user = user
        next()
      })
}

exports.GenAccessToken = function(username) {
    return jwt.sign({username : username}, JWT_SECRET, {expiresIn: 60*60})

}

exports.ValidateEmail = function(username){
    const regexExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
    if (regexExp.test(username)){
        return true
    } else {
        return false
    }
}