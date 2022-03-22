'use strict'
const crypto = require('crypto');

var DB = require('../database/database')
var helper = require('../helpers/authHelper')

require('dotenv').config();

const USERS_DB_TABLE = process.env.USERS_DB_TABLE_NAME


exports.SignUp = function(req, res) {
    var username = req.body.username
    var password = req.body.password
    console.log(username, password)

    DB.CheckForEmail(USERS_DB_TABLE, req.body.username, function(err, result){
        if(err) { console.log(err); res.send(500, "Server Error"); return; }
        console.log(result)
    })

    if (helper.ValidateEmail(username)){
        var hashedPassword = helper.SaltPassword(password)
        const INPUT = {
            user : username,
            password : hashedPassword
        }
        DB.InsertIntoDB(USERS_DB_TABLE, INPUT, function(err, result){
            if(err) { console.log(err); res.send(500, "Server Error"); return; }
            var ID = result.insertId
            
            INPUT["ID"] = ID
            res.send(INPUT)
        })
    } else {
        res.sendStatus(400).send("Invalid Email")
    }
}

exports.AllUsers = function(req, res){
    DB.GetAllFromDB(USERS_DB_TABLE, function(err, result){
        if(err) { console.log(err); res.send(500, "Server Error"); return; }
        console.log(result)
        res.send(result)
    })
}

exports.Test = function(req, res){
    DB.CheckForEmail(USERS_DB_TABLE, req.body.username, function(err, result){
        if(err) { console.log(err); res.send(500, "Server Error"); return; }
        console.log(result)
    })
    res.send("Token verified")
}


