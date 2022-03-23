'use strict'
const crypto = require('crypto');

var DB = require('../database/database')
var helper = require('../helpers/authHelper')

require('dotenv').config();

const USERS_DB_TABLE = process.env.USERS_DB_TABLE_NAME


exports.SignUp = function(req, res) {
    var username = req.body.username
    var password = req.body.password

    DB.CheckForEmail(USERS_DB_TABLE, username, function(err, result){
        if(err) { console.log(err); res.sendStatus(500); return; }
        if (result.length === 0){
            if (helper.ValidateEmail(username)){
                var hashedPassword = helper.SaltPassword(password)
                const INPUT = {
                    user : username,
                    password : hashedPassword
                };
                DB.InsertIntoDB(USERS_DB_TABLE, INPUT, function(err, result){
                    if(err) { console.log(err); res.sendStatus(500); return; }
                    var ID = result.insertId;
                    INPUT["ID"] = ID;
                    const token = helper.GenAccessToken(INPUT.user)
                    res.set('token', [token])
                    res.status(200).send("User successfully signed up");
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

exports.Login = function(req, res){
    var username = req.body.username
    var password = req.body.password


    DB.CheckForEmail(USERS_DB_TABLE, username, function(err, result){
        if(err) { console.log(err); res.sendStatus(500); return; }
        if (result.length === 0){
            res.status(400).send("Incorrect Details")
        } else {
            var saltHashPword = result[0]['password']
            const salt = saltHashPword.slice(0, 24)
            console.log(salt)
            var hashPword = saltHashPword.slice(24)

            const password2Check = helper.HashPasswordWithSalt(password, salt)
            if (password2Check === hashPword){
                var token = helper.GenAccessToken(username)
                token = 'Bearer ' + token
                res.set('authorization', [token])
                res.send("Logged in")

            } else {
                res.status(400).send("Incorrect Details")
            }
        }
    })
}



exports.AllUsers = function(req, res){
    DB.GetAllFromDB(USERS_DB_TABLE, function(err, result){
        if(err) { console.log(err); res.sendStatus(500); return; }
        console.log(result)
        res.send(result)
    })
}


