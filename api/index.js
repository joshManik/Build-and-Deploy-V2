const express = require('express');
const cors = require('cors');
const multer = require('multer');
const rateLimit = require("express-rate-limit");
const { body, param } = require('express-validator')

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

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: "Too many requests, please try again after 15 minutes"

  // this above message is shown to user when max requests is exceeded
});

const app = express();

app.use(express.json());
app.use(cors({ credentials: true }))
app.use('/images', express.static(__dirname + '/images'));
app.use(limiter);

require('dotenv').config();


app.get('/initialize', INIT.InitialQuery)

// Image upload endpoint

app.post('/image/upload', authHelper.AuthenticateToken ,upload.single('image', 1),(req, res) => {
    console.log(`Recieved ${req.file.filename} it is uploaded to the backend server`)
    res.send(req.file.path)
})

// Project Endpoints

app.get('/projects/all', projects.GetAll)

app.post('/projects/create', upload.array('images', 3), projects.Create)

app.get('/projects/:id', param(['id']).isInt(), projects.GetSpecific)

app.put('/projects/:id', param(['id']).isInt(), upload.array('images', 3), projects.UpdateSpecific)

app.delete('/projects/:id', projects.DeleteSpecific)

// Blog Endpoints

app.get('/blogs/all', blog.GetAll)

app.post('/blogs/create', authHelper.AuthenticateToken, blog.Create)

app.get('/blogs/:id', blog.GetSpecific)

app.put('/blogs/:id', blog.UpdateSpecific)

app.delete('/blogs/:id', blog.DeleteSpecific)

// Auth Endpoints

app.post('/signup', auth.SignUp)

app.post('/login', body(['email']).isEmail(), auth.Login)

app.post('/refresh', authHelper.AuthenticateToken, authHelper.RefreshToken)

app.get('/users/all', auth.AllUsers)

app.get('/auth', authHelper.AuthenticateToken, (req, res) => {res.sendStatus(200)})

app.get('/admin/auth', authHelper.AuthenticateToken, auth.AdminAuth)

app.get('/verify/email/:token', authHelper.AuthenticateVerifyToken, auth.VerifyEmail)

app.post('/email/test', auth.GetEmailToken)

app.post('/send/email', auth.SendEmail)

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server is running on port : ${process.env.SERVER_PORT}`)
});
