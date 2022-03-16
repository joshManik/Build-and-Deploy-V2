const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');

var DB = require('./database/database')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './assets/images')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})

var upload = multer({ storage: storage })

const app = express();

app.use(express.json());
app.use(cors({ credentials: true }))

require('dotenv').config();

DB.InitialProjectsQuery(() => {
    console.log("Made initial past project table")
})

DB.InitialBlogPostsQuery(() => {
    console.log("Made initial blog posts table")
})

DB.InitialCommentsQuery(() => {
    console.log("Made initial comments table")
})


app.use('/images', express.static(__dirname + 'api/assets/images'));

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server is running on port : ${process.env.SERVER_PORT}`)
});
