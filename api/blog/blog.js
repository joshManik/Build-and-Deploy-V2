'use strict'

var DB = require('../database/database')
var helper = require('../helpers/blogHelper')

require('dotenv').config();

const BLOG_DB_TABLE = process.env.BLOG_DB_TABLE_NAME

exports.GetAll = function(req, res){
    DB.GetAllFromDB(BLOG_DB_TABLE, function(err, result){
        if(err) { console.log(err); res.send(500, "Server Error"); return; }
        res.send(result)
    })
}

exports.GetSpecific = function(req, res) {
    DB.SelectFromID(BLOG_DB_TABLE, req.params.id, function(err, result){
        if(err) { console.log(err); res.send(500, "Server Error"); return; }
        res.send(result)
    })
}

exports.UpdateSpecific = function(req, res){
    helper.BlogMiddleware(req).then(INPUT => {
        DB.UpdateFromID(BLOG_DB_TABLE, req.params.id, INPUT, function(err, result){
            if(err) { console.log(err); res.send(500, "Server Error"); return; }
            res.send(result)
        })
    })
}

exports.DeleteSpecific = function(req, res){
    DB.DeleteFromID(BLOG_DB_TABLE, req.params.id, function(err, result){
        if(err) { console.log(err); res.send(500, "Server Error"); return; }
        res.send(result)
    })
}

exports.Create = function(req, res){
    helper.BlogMiddleware(req).then(INPUT => {
        DB.InsertIntoDB(BLOG_DB_TABLE, INPUT, function(err, result){
            if(err) { console.log(err); res.send(500, "Server Error"); return; }
            var ID = result.insertId
            INPUT["ID"] = ID
            res.send(INPUT)
        })
    })
}