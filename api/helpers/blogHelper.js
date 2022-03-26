'use strict'

const jwt = require('jsonwebtoken');

const authHelper = require('./authHelper')

exports.BlogMiddleware = function(req){
    return new Promise((resolve, reject) => {
        if (req.body.post === undefined){
            reject(false)
        } else {

            var p = authHelper.GetDataFromToken(req.headers['authorization'])



            console.log(p)
            jwt.verify()

            if (req.params.id === undefined){
                var INPUT = {
                    title : req.body.title, 
                    post : req.body.post,
                    author : "Josh Manik",
                }
            } else {
                var INPUT = {
                    title : req.body.title, 
                    post : req.body.post,
                    author : "Josh Manik",
                    ID : req.params.id
                }
            }
            resolve(INPUT)
        }
    })
}
