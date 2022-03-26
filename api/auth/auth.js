'use strict'
const crypto = require('crypto');

var DB = require('../database/database')
var helper = require('../helpers/authHelper')

require('dotenv').config();

const USERS_DB_TABLE = process.env.USERS_DB_TABLE_NAME


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
                    password : hashedPassword
                };
                DB.InsertIntoDB(USERS_DB_TABLE, INPUT, function(err, result){
                    if(err) { console.log(err); res.sendStatus(500); return; }
                    var ID = result.insertId;
                    INPUT["ID"] = ID;
                    const token = helper.GenAccessToken({email : INPUT.email, username : INPUT.username})
                    res.send({
                        "token" : token
                    })
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
                var token = helper.GenAccessToken({email : result[0].email, username : result[0].username})
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



exports.AllUsers = function(req, res){
    DB.GetAllUsersFromDB(USERS_DB_TABLE, function(err, result){
        if(err) { console.log(err); res.sendStatus(500); return; }
        console.log(result)
        res.send(result)
    })
}


