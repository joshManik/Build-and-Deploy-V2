'use strict'

exports.BlogMiddleware = function(req){
    return new Promise((resolve, reject) => {
        if (req.body.post === undefined){
            reject(false)
        } else {


            if (req.params.id === undefined){
                var INPUT = {
                    title : req.body.title, 
                    post : req.body.post,
                    author : "Josh Manik",
                    ID : 0
                }
            } else {
                var INPUT = {
                    title : req.body.title, 
                    post : req.body.post,
                    author : "Josh Manik",
                    ID : req.params.id
                }
            }
            resolve(INPUT)
        }
    })
}

exports.ProjectsMiddleware = function(req){

    return new Promise((resolve, reject) =>{
        console.log(req.body)
        var fileCount = req.body.fileCount
        if (fileCount === undefined){
            console.log("filecount undefined")
            reject(false)
        } else {
                // Switch bools to numbers to input into DB

    if (req.body.carousel == 'true') {
        var carousel = 1
    } else {
        var carousel = 0
    }
    if (req.body.project_live == 'true') {
        var project_live = 1
    } else {
        var project_live = 0
    }

    if (req.body.github_live == 'true') {
        var github_live = 1
    } else {
        var github_live = 0
    }

    if (fileCount == 3){
        var INPUT = {
            title : req.body.title,
            paragraph_one : req.body.paragraph_one,
            paragraph_two : req.body.paragraph_two,
            tech_used : req.body.tech_used,
            project_live : project_live,
            project_link : req.body.project_link,
            github_live : github_live,
            github_link : req.body.github_link,
            image1_path : req.files[0].path,
            image2_path : req.files[1].path,
            image3_path : req.files[2].path,
            carousel : carousel,
            ID : 0
        }
    } if (fileCount == 2){
        var INPUT = {
            title : req.body.title,
            paragraph_one : req.body.paragraph_one,
            paragraph_two : req.body.paragraph_two,
            tech_used : req.body.tech_used,
            project_live : project_live,
            project_link : req.body.project_link,
            github_live : github_live,
            github_link : req.body.github_link,
            image1_path : req.files[0].path,
            image2_path : req.files[1].path,
            carousel : carousel,
            ID : 0
        }
    } if (fileCount == 1) {
        var INPUT = {
            title : req.body.title,
            paragraph_one : req.body.paragraph_one,
            paragraph_two : req.body.paragraph_two,
            tech_used : req.body.tech_used,
            project_live : project_live,
            project_link : req.body.project_link,
            github_live : github_live,
            github_link : req.body.github_link,
            image1_path : req.files[0].path,
            carousel : carousel,
            ID : 0
        }
    }
    resolve(INPUT)
        }
    })
}