'use strict'

var DB = require('../database/database')
const { validationResult } = require('express-validator');
var helper = require('../helpers/projectHelper')

require('dotenv').config();

const PASTPROJECT_DB_TABLE = process.env.PASTPROJECT_DB_TABLE_NAME

exports.GetAll = function(req, res){
    DB.GetAllFromDB(PASTPROJECT_DB_TABLE, function(err, result){
        if(err) { console.log(err); res.send(500, "Server Error"); return; }
        res.send(result)
    })
}

exports.GetSpecific = function(req, res){
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).send("Invalid Value Provided")
    } else {
    DB.SelectFromID(PASTPROJECT_DB_TABLE,  req.params.id, function(err, result){
        if(err) { console.log(err); res.send(500, "Server Error"); return; }
        res.send(result)
    })
    }
}

exports.UpdateSpecific = function(req, res){
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).send("Invalid Value Provided")
    } else {
    if (req.body.newFile === true){
        helper.ProjectsMiddleware(req).then(INPUT => {
            DB.InsertIntoDB(PASTPROJECT_DB_TABLE, INPUT, function(err, result){
                if(err) { console.log(err); res.send(500, "Server Error"); return; }
                res.send(INPUT)
            })
        })
    } else {
        helper.UpdateProjectsMiddleware(req).then(INPUT => {
            DB.UpdateFromID(PASTPROJECT_DB_TABLE, req.params.id, INPUT, function(err, result){
                if(err) { console.log(err); res.send(500, "Server Error"); return; }
                res.send(INPUT)
            })
        })
    }
}
}

exports.DeleteSpecific = function(req, res){
    DB.DeleteFromID(PASTPROJECT_DB_TABLE, req.params.id, function(err, result){
        if(err) { console.log(err); res.send(500, "Server Error"); return; }
        res.send(result)
    })
}

exports.Create = function(req, res){
    helper.ProjectsMiddleware(req).then(INPUT => {
        DB.InsertIntoDB(PASTPROJECT_DB_TABLE, INPUT, function(err, result){
            if(err) { console.log(err); res.send(500, "Server Error"); return; }
            var ID = result.insertId
            INPUT["ID"] = ID
            res.send(INPUT)
        })
    })
}