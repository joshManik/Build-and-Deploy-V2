'use strict'

exports.GetAll = function(req, res){
    const QUERY = `SELECT * FROM ${PASTPROJECT_DB_TABLE}`
    DB.query(QUERY, (err, result) => {
        if (err) throw err;
        res.send(result)
    });
}