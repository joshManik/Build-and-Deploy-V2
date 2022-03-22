'use strict'

exports.BlogMiddleware = function(req){
    return new Promise((resolve, reject) => {
        if (req.body.post === undefined){
            reject(false)
        } else {


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
