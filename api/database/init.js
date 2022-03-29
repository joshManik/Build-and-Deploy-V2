
var DB = require('../database/database')
var helper = require('../helpers/authHelper')

require('dotenv').config();

const USERS_DB_TABLE = process.env.USERS_DB_TABLE_NAME
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

// Initial Setup Query

exports.InitialQuery = function(req, res){
    let stat = 'DBS : '
    DB.InitialProjectsQuery((err, result) => {
        if (err === false){
            console.log("Projects table CREATED")
            var project_status = "Projects table CREATED "
            stat += project_status
            DB.InitialBlogPostsQuery((err, result) => {
                if (err === false){
                    console.log("Blog Posts table CREATED")
                    var blog_status = "Blog Posts table CREATED "
                    stat += blog_status
                    DB.InitialCommentsQuery((err, result) => {
                        if (err === false){
                            console.log("Comments table CREATED")
                            var comments_status = "Comments table CREATED "
                            stat += comments_status
                            DB.InitialUsersQuery((err, result) => {
                                if (err === false){
                                    console.log("Users table CREATED")
                                    var users_status = "Users table CREATED"
                                    stat += users_status
                                    DB.CheckForEmail(USERS_DB_TABLE, "joshmanik1@gmail.com", function(err, result){
                                        if(err) { console.log(err); res.send({
                                            usersDB : users_status,
                                            ProjectsDB : project_status,
                                            BlogsDB : blog_status,
                                            CommentsDB : comments_status,
                                            adminAccount : "NOT CREATED"
                                        }); return; }

                                        // Check for email upon initialize to make sure we dont make 2 of the same admin accounts

                                        if (result.length === 0){
                                        const INPUT = {
                                            username : "36Boxes",
                                            email : "joshmanik1@gmail.com",
                                            admin : true,
                                            password : helper.SaltPassword(ADMIN_PASSWORD)
                                        }
                                        DB.InsertIntoDB(USERS_DB_TABLE, INPUT, function(err, result){
                                            if(err) { console.log(err); res.send(500, "Server Error"); return; }
                                        })
                                        res.send({
                                            usersDB : users_status,
                                            ProjectsDB : project_status,
                                            BlogsDB : blog_status,
                                            CommentsDB : comments_status,
                                            adminAccount : "CREATED"
                                        })
                                        return
                                    } else {
                                        // If its already 
                                        res.send({
                                            usersDB : users_status,
                                            ProjectsDB : project_status,
                                            BlogsDB : blog_status,
                                            CommentsDB : comments_status,
                                            adminAccount : "ALREADY CREATED"
                                        })
                                    }
                                    })
                                } else {
                                    console.log("Users table NOT CREATED")
                                    var users_status = "Users table NOT CREATED"
                                    stat += users_status
                                    res.send({
                                        usersDB : users_status,
                                        ProjectsDB : project_status,
                                        BlogsDB : blog_status,
                                        CommentsDB : comments_status
                                    })
                                    return
                                }
                            })
                        } else {
                            console.log("Comments table NOT CREATED")
                            var comments_status = "Comments table NOT CREATED "
                            stat += comments_status
                            res.send({
                                ProjectsDB : project_status,
                                BlogsDB : blog_status,
                                CommentsDB : comments_status
                            })
                            return
                        }
                    })
        
                } else {
                    console.log("Blog Posts table NOT CREATED")
                    var blog_status = "Blog Posts table NOT CREATED "
                    stat += blog_status
                    res.send({
                        ProjectsDB : project_status,
                        BlogsDB : blog_status
                    })
                    return
                }
            })
        } else {
            console.log("Projects table NOT CREATED")
            var project_status = "Projects table NOT CREATED "
            stat += project_status
            res.send({
                ProjectsDB : project_status
            })
            return
        }
    })
}