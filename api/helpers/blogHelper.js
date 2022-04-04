'use strict'

const jwt = require('jsonwebtoken');

const authHelper = require('./authHelper')

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET

exports.BlogMiddleware = function(res, req){
    return new Promise((resolve, reject) => {
        if (req.body.post === undefined){
            reject(false)
        } else {

            console.log(res.locals.result)

            if (req.params.id){
                var INPUT = {
                    title : req.body.title, 
                    post : req.body.post,
                    author : res.locals.result.email.username,
                    ID : req.params.id
                }
            } else {
                var INPUT = {
                    title : req.body.title, 
                    post : req.body.post,
                    author : res.locals.result.email.username
                }
            }
            resolve(INPUT)
        }
    })
}
