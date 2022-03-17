const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');

var DB = require('./database/database')
var projects = require('./projects/projects')
var blog = require('./blog/blog')

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

// Image upload endpoints

app.use('/images', express.static(__dirname + 'api/assets/images'));

app.post('/image/upload', upload.single('image', 1),(req, res) => {
    console.log(`Recieved ${req.file.filename} it is uploaded to the backend server`)
    res.send(req.file.path)
})

// Project Endpoints

app.get('/projects/all', projects.GetAll)

app.post('/projects/create', upload.array('images', 3), projects.Create)

app.get('/projects/:id', projects.GetSpecific)

app.put('/projects/:id', projects.UpdateSpecific)

app.delete('/projects/:id', projects.DeleteSpecific)

// Blog Endpoints

app.get('/blog/all', blog.GetAll)

app.post('/blog/create', blog.Create)

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server is running on port : ${process.env.SERVER_PORT}`)
});
