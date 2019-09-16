var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require('../models/comment');
var middleware = require("../middleware/index.js");


//================================================================
// COMMENTS
//================================================================

// NEW COMMENT
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn , function (req, res) {
    //find campground by id
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err)
        }
        else {
            res.render("comments/new.ejs", { campground: campground });
        }
    })
})

// CREATE COMMENT
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function (req, res) {
    //find campground by id
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        }
        else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                }
                else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    //Push to campground and save
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
    //create new comment
    //connect new comment to found campground
    //redirect to campground showpage
});

//EDIT COMMENT
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership ,function(req,res){
    Comment.findById(req.params.comment_id , function(err , foundComment){
        console.log("comment is " + foundComment);
        if(err){
            res.redirect("back");
        }
        else{
           res.render("comments/edit" , {campground_id : req.params.id , comment : foundComment});
        }
    })
});

//UPDATE COMMENT
router.put("/campgrounds/:id/comments/:comment_id" ,middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndUpdate( req.params.comment_id, req.body.comment , function(err , updatedComment){
        if(err){
            res.redirect("back");
        }
        else{
            res.redirect("/campgrounds/" + req.params.id );
        }
    })
})

//COMMENT DESTROY ROUTE
router.delete("/campgrounds/:id/comments/:comment_id" ,middleware.checkCommentOwnership, function( req, res){
    Comment.findByIdAndRemove(req.params.comment_id , function(err){
        if(err){
            res.redirect("back");
        }
        else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

module.exports = router;