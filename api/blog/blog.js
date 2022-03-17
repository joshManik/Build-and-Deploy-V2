'use strict'

var DB = require('../database/database')

require('dotenv').config();

const BLOG_DB_TABLE = process.env.BLOG_DB_TABLE_NAME

exports.GetAll = function(req, res){
    DB.GetAllFromDB(BLOG_DB_TABLE, function(err, result){
        if(err) { console.log(err); res.send(500, "Server Error"); return; }
        res.send(result)
    })
}