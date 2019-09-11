var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

//now we will add all the routes to route rather than adding to app (e.g. router.get instead of app.get)
//And we will export router in the end

//INDEX ROUTE - Show all campgrounds
router.get("/", function (req, res) {
    //Get all campgrounds from db
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err)
        }
        else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds, currentUser: req.user })
        }
    })
})

// NEW ROUTE - Show form to create new campground
router.get("/new", isLoggedIn, function (req, res) {
    res.render("campgrounds/new.ejs");
})

//CREATE ROUTE - Add new campground to database
router.post("/", isLoggedIn, function (req, res) {
    //Get data from form and add to the db
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = { name: name, image: image, description: desc, author: author };
    //Create a new campground and save to dbs
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err)
        }
        else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    })
})

// SHOW ROUTE - Show detailed information for the clicked campground
router.get("/:id", function (req, res) {
    //find the campground with the provided id
    var myId = req.params.id
    Campground.findById(myId).populate("comments").exec(function (err, foundCampground) {
        //.populate().exec() To show the comments which are associated with the Campgrounds rather than displaying just IDs
        if (err) {
            console.log(err)
        } else {
            console.log(foundCampground)
            //render show tempelate with that campground
            res.render("campgrounds/show", { campground: foundCampground });
        }
    })
})

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", function (req, res) {
    Campground.findById(req.params.id,function(err, foundCampground){
        if(err){
            res.redirect("/campgrounds")
        }
        else{
            res.render("campgrounds/edit", { campground: foundCampground });
        }
    })
})

//UPDATE CAMPGROUND ROUTE
router.put("/:id" , function(req,res){
    //find and update the correct campground
    var data =  {name : req.body.name , image:req.body.image , description : req.body.description}
    Campground.findByIdAndUpdate(req.params.id , data , function( err,updatedCampground) {
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds/" + req.params.id ) //or updatedCampground.id
        }
    })
    //redirect to somewhere(show page)
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;