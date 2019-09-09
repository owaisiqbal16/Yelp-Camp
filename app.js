var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    app = express(),
    Campground = require("./models/campground"), //can use any name rather than campground
    Comment = require("./models/comment"),
    seedDB = require("./seeds");


seedDB();
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// =============
// R O U T I N G
// =============
app.get("/", function (req, res) {
    res.render("landing");
})

//INDEX ROUTE - Show all campgrounds
app.get("/campgrounds", function (req, res) {
    //Get all campgrounds from db
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err)
        }
        else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds })
        }
    })
})

// NEW ROUTE - Show form to create new campground
app.get("/campgrounds/new", function (req, res) {
    res.render("campgrounds/new.ejs");
})

//CREATE ROUTE - Add new campground to database
app.post("/campgrounds", function (req, res) {
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
app.get("/campgrounds/:id", function (req, res) {
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

//================================================================
// COMMENTS
//================================================================

// NEW COMMENT
app.get("/campgrounds/:id/comments/new", function (req, res) {
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
app.post("/campgrounds/:id/comments", function (req, res) {
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
})

app.listen(3000, function () {
    console.log("Server is running at 3000");
})