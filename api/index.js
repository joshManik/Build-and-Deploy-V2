const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path')

var DB = require('./database/database')
var projects = require('./projects/projects')
var blog = require('./blog/blog')
var auth = require('./auth/auth')
var authHelper = require('./helpers/authHelper')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './images')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})

var upload = multer({ storage: storage })

const app = express();

app.use(express.json());
app.use(cors({ credentials: true }))
app.use('/images', express.static(__dirname + '/images'));

require('dotenv').config();


app.get('/initialize', (req, res) => {
    var stat = []
    DB.InitialProjectsQuery((err, res) => {
        if (err === false){
            console.log("Projects table CREATED")
            stat.push("Projects table CREATED")
        } else {
            console.log("Projects table NOT CREATED")
            stat.push("Projects table NOT CREATED")
        }
    })
    
    DB.InitialBlogPostsQuery((err, res) => {
        if (err === false){
            console.log("Blog Posts table CREATED")
            stat.push("Blog Posts table CREATED")

        } else {
            console.log("Blog Posts table NOT CREATED")
            stat.push("Blog Posts table NOT CREATED")
        }
    })
    
    DB.InitialCommentsQuery((err, res) => {
        if (err === false){
            console.log("Comments table CREATED")
            stat.push("Comments table CREATED")
        } else {
            console.log("Comments table NOT CREATED")
            stat.push("Comments table NOT CREATED")
        }
    })

    DB.InitialUsersQuery((err, res) => {
        if (err === false){
            console.log("Users table CREATED")
            stat.push("Users table CREATED")
        } else {
            console.log("Users table NOT CREATED")
            stat.push("Users table NOT CREATED")
        }
    })

    res.send(stat)
})

// Image upload endpoint

app.post('/image/upload', upload.single('image', 1),(req, res) => {
    console.log(`Recieved ${req.file.filename} it is uploaded to the backend server`)
    res.send(req.file.path)
})

// Project Endpoints

app.get('/projects/all', projects.GetAll)

app.post('/projects/create', upload.array('images', 3), projects.Create)

app.get('/projects/:id', projects.GetSpecific)

app.put('/projects/:id', upload.array('images', 3), projects.UpdateSpecific)

app.delete('/projects/:id', projects.DeleteSpecific)

// Blog Endpoints

app.get('/blog/all', blog.GetAll)

app.post('/blog/create', blog.Create)

app.get('/blog/:id', blog.GetSpecific)

app.put('/blog/:id', blog.UpdateSpecific)

app.delete('/blog/:id', blog.DeleteSpecific)

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server is running on port : ${process.env.SERVER_PORT}`)
});

// Auth Endpoints

app.post('/sign-up', auth.Test )

app.post('/token', auth.SignUp)

app.get('/test', authHelper.AuthenticateToken, auth.Test)

app.get('/users/all', auth.AllUsers)
