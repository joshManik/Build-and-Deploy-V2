'use strict'
const { validationResult } = require('express-validator');
const nodemailer = require("nodemailer");
const path = require("path");
var fs = require('fs');
var handlebars = require('handlebars');



var DB = require('../database/database')
var helper = require('../helpers/authHelper')

require('dotenv').config();

const USERS_DB_TABLE = process.env.USERS_DB_TABLE_NAME
const REACT_APP_URL = process.env.REACT_APP_URL


exports.SignUp = function(req, res) {
    var username = req.body.username
    var email = req.body.email
    var password = req.body.password

    DB.CheckForEmail(USERS_DB_TABLE, email, function(err, result){
        if(err) { console.log(err); res.sendStatus(500); return; }
        if (result.length === 0){
            if (helper.ValidateEmail(email)){
                var hashedPassword = helper.SaltPassword(password)
                const INPUT = {
                    email : email,
                    username : username,
                    password : hashedPassword,
                    admin : false,
                    verified : false
                };
                DB.InsertIntoDB(USERS_DB_TABLE, INPUT, function(err, result){
                    if(err) { console.log(err); res.sendStatus(500); return; }
                    var ID = result.insertId;
                    INPUT["ID"] = ID;
                    var token = helper.GenAccessToken({email : INPUT.email, username : INPUT.username, verified : INPUT.verified, admin : INPUT.admin})
                    token = 'Bearer ' + token
                    const verificationToken = helper.GenEmailValidationToken(INPUT.email, INPUT.username)
                    const context = {
                        name : INPUT.username,
                        verify : REACT_APP_URL + "users/verify/" + verificationToken
                    }

                    /// This doesnt work needs fixing 

                    if (helper.SendVerifyEmail(context, INPUT.email)){
                        res.send({
                            "token" : token,
                            "verify" : "SENT"
                        })
                    } else {
                        res.send({
                            "token" : token,
                            "verify" : "SENT"
                        })
                    }
                    return;
                })
            } else {
                res.status(400).send("Email is invalid");
                return;
            }
        } else {
            res.status(400).send("User is already in our system");
            return;
            }

    })
}

exports.AdminAuth = function(req, res){
    DB.CheckForEmail(USERS_DB_TABLE, res.locals.result.email.email, function(err, result){
        if (result[0].admin){
            res.send(200)
        } else {
            res.status(200).send("Not Allowed")
        }
    })
}

exports.Login = function(req, res){

    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).send("Invalid Value Provided")
    } else {
    var email = req.body.email
    var password = req.body.password


    DB.CheckForEmail(USERS_DB_TABLE, email, function(err, result){
        if(err) { console.log(err); res.sendStatus(500); return; }
        if (result.length === 0){
            res.status(400).send("Incorrect Details")
        } else {
            var saltHashPword = result[0]['password']
            const salt = saltHashPword.slice(0, 24)
            var hashPword = saltHashPword.slice(24)

            const password2Check = helper.HashPasswordWithSalt(password, salt)
            if (password2Check === hashPword){
                var token = helper.GenAccessToken({email : result[0].email, username : result[0].username, verified : result[0].verified, admin : result[0].admin})
                token = 'Bearer ' + token
                res.set('authorization', [token])
                res.send({
                    "token" : token
                })

            } else {
                res.status(400).send("Incorrect Details")
            }
        }
    })
}
}



exports.AllUsers = function(req, res){
    DB.GetAllUsersFromDB(USERS_DB_TABLE, function(err, result){
        if(err) { console.log(err); res.sendStatus(500); return; }
        console.log(result)
        res.send(result)
    })
}

exports.GetSingleUser = function(req, res){
    const jwtEmail = res.locals.result.email.email
    const paramEmail = req.params.email
    
    if (jwtEmail === paramEmail){
        res.send({
            username : res.locals.result.email.username,
            email : res.locals.result.email.email
        })
    } else {
        res.send(401)
    }

}

exports.VerifyEmail = function(req, res){
    DB.CheckForEmail(USERS_DB_TABLE, res.locals.result.email, (err, result) => {
        if(err) { console.log(err); res.sendStatus(500); return; }
        if (result.length === 0){
            res.status(400).send("Error occured 1")
        } else {
            if (helper.ValidateEmail(res.locals.result.email)){
                DB.UpdateUserFromEmail(USERS_DB_TABLE, res.locals.result.email, (err, result) => {
                    if(err) { console.log(err); res.sendStatus(500); return; }

                    // Need to send a new token here with updated values

                    DB.CheckForEmail(USERS_DB_TABLE, res.locals.result.email, (err, result) => {
                        var token = helper.GenAccessToken({email : result[0].email, username : result[0].username, verified : result[0].verified, admin : result[0].admin})
                        token = 'Bearer ' + token
                        res.set('authorization', [token])
                        res.send({
                            "token" : token
                        })
                    })
                })
            } else {
                res.status(400).send("Error Occured 2")
            }
        }
    })
}

exports.GetInContact = function(req, res) {

    const recipient = req.body.email

    const context = {
        name : req.body.name,
        content : req.body.message
    }

    helper.GetInContact(context)

    helper.SendReceipt(context, recipient)

    res.send("email sent")

}

exports.FindWhoIAm = function(req, res) {
    //check for email

    DB.CheckForEmail(USERS_DB_TABLE, res.locals.result.email.email, (err, result) => {
        if(err) { console.log(err); res.sendStatus(500); return; }
        res.send({
            id : result[0].id,
            username : result[0].username,
            email : result[0].email
        })
    })


}