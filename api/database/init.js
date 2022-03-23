
var DB = require('../database/database')

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
                                    res.send({
                                        usersDB : users_status,
                                        ProjectsDB : project_status,
                                        BlogsDB : blog_status,
                                        CommentsDB : comments_status
                                    })
                                    return
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