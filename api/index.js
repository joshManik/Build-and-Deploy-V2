const express = require('express');
const cors = require('cors');
const multer = require('multer');

var INIT = require('./database/init')
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


app.get('/initialize', INIT.InitialQuery)

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

app.post('/blog/create', authHelper.AuthenticateToken, blog.Create)

app.get('/blog/:id', blog.GetSpecific)

app.put('/blog/:id', blog.UpdateSpecific)

app.delete('/blog/:id', blog.DeleteSpecific)

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server is running on port : ${process.env.SERVER_PORT}`)
});

// Auth Endpoints

app.post('/signup', auth.SignUp)

app.post('/login', auth.Login)

app.post('/refresh', authHelper.AuthenticateToken, authHelper.RefreshToken)

app.get('/users/all', auth.AllUsers)

app.get('/auth', authHelper.AuthenticateToken, (req, res) => {
  console.log(req)
  res.sendStatus(200)

})
