'use strict'
const crypto = require('crypto');

const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const path = require("path");
var fs = require('fs');
var handlebars = require('handlebars');



require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET
const ALTJWT_SECRET = process.env.ALTJWT_SECRET
const EMAILPASSWORD = process.env.EMAILPASSWORD

exports.SaltPassword = function(password){
    const salt = crypto.randomBytes(16).toString('base64');
    var hash = crypto.createHmac('sha512', salt)
    hash.update(password);
    var value = hash.digest('hex');
    return (salt + value)
}

exports.HashPasswordWithSalt = function(password, salt){
    var hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    var value = hash.digest('hex');
    return value
}

exports.AuthenticateToken = function(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, JWT_SECRET, (err, result) => {
        if (err) { console.log(err); res.sendStatus(403); return;}
        res.locals.result = result
        next()
      })
}

exports.AuthenticateVerifyToken = function(req, res, next){
    const token = req.params.token
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, ALTJWT_SECRET, (err, result) => {
        if (err) { console.log(err); res.sendStatus(403); return;}
        res.locals.result = result
        next()
      })
}

exports.GetDataFromToken = function(token){
    const payload = jwt.verify(token, JWT_SECRET)
    console.log(payload, "payload is here")
    return payload
}

exports.GenAccessToken = function(email, username) {
    return jwt.sign({email : email, username : username}, JWT_SECRET, {expiresIn: 60*60})

}

exports.RefreshToken = function(req, res){
    const token = req.body.token && req.body.token.split(' ')[1]
    const payload = jwt.verify(token, JWT_SECRET)
    delete payload.iat;
    delete payload.exp;
    delete payload.nbf;
    delete payload.jti;
    return res.send({
        "RefreshToken" : jwt.sign(payload, JWT_SECRET, {expiresIn: 60*60})
    })
}

exports.ValidateEmail = function(username){
    const regexExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
    if (regexExp.test(username)){
        return true
    } else {
        return false
    }
}

exports.GenEmailValidationToken = function(email, username) {
    return jwt.sign({email : email, username : username}, ALTJWT_SECRET, {expiresIn: 60*60})

}

exports.SendEmail = function(context, recipient) {

    const filePath = path.resolve(__dirname, "./templates/email.html")
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source)
    const emailHTML = template(context)

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: '36boxesemailservice@gmail.com',
          pass: EMAILPASSWORD
        }
      });
      
      const mailOptions = {
        from: '36boxesemailservice@gmail.com',
        to: recipient,
        subject: '36Boxes Email Verification',
        html: emailHTML
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          return false
        } else {
          console.log('Email sent: ' + info.response);
          return true
        }
      });

}

