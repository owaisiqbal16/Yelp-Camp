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
router.get("/new", function (req, res) {
    res.render("campgrounds/new.ejs");
})

//CREATE ROUTE - Add new campground to database
router.post("/", function (req, res) {
    //Get data from form and add to the db
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = { name: name, image: image, description: desc };
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

module.exports = router;