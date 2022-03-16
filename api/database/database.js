const mysql = require('mysql2');

require('dotenv').config();

const PASTPROJECT_DB_TABLE = process.env.PASTPROJECT_DB_TABLE_NAME
const BLOG_DB_TABLE = process.env.BLOG_DB_TABLE_NAME
const COMMENTS_DB_TABLE = process.env.COMMENTS_DB_TABLE_NAME

var pool = mysql.createPool({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME,
    port : process.env.DB_PORT
  });

exports.InitialProjectsQuery = function(callback){
    var sql = `CREATE TABLE IF NOT EXISTS ${PASTPROJECT_DB_TABLE} (
        id INT PRIMARY KEY UNIQUE AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        paragraph_one TEXT NOT NULL,
        paragraph_two TEXT NOT NULL,
        tech_used VARCHAR(255) NOT NULL,
        project_live BOOLEAN NOT NULL,
        project_link VARCHAR(255),
        github_live BOOLEAN NOT NULL,
        github_link VARCHAR(255),
        image1_path VARCHAR(255) NOT NULL,
        image2_path VARCHAR(255),
        image3_path VARCHAR(255),
        carousel BOOLEAN NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`

    pool.getConnection(function(err, connection){
        if(err) { console.log(err); callback(true); return; }
        connection.query(sql, function(err, result){
            connection.release()
            if(err) { console.log(err); callback(true); return; }
            callback(false, result);
        })
    })
}

exports.InitialBlogPostsQuery = function(callback){
    var sql = `CREATE TABLE IF NOT EXISTS ${BLOG_DB_TABLE} (
        id INT PRIMARY KEY UNIQUE AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        post TEXT NOT NULL,
        author VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`

    pool.getConnection(function(err, connection){
        if(err) { console.log(err); callback(true); return; }
        connection.query(sql, function(err, result){
            connection.release()
            if(err) { console.log(err); callback(true); return; }
            callback(false, result);
        })
    })
}

exports.InitialCommentsQuery = function(callback){
    var sql = `CREATE TABLE IF NOT EXISTS ${COMMENTS_DB_TABLE} (
        id INT PRIMARY KEY UNIQUE AUTO_INCREMENT,
        blog_id INT NOT NULL,
        comment VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        likes INT NOT NULL,
        dislikes INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`

    pool.getConnection(function(err, connection){
        if(err) { console.log(err); callback(true); return; }
        connection.query(sql, function(err, result){
            connection.release()
            if(err) { console.log(err); callback(true); return; }
            callback(false, result);
        })
    })
}