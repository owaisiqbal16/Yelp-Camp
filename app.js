var express = require('express'),
    app = express(),
    bodyParser = require("body-parser"),  //to use req.body
    mongoose = require("mongoose"),
    Campground = require("./models/campground"); //can use any name rather than campground

mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Campground.create({
//     name: "Campground 2",
//     image: "https://images.unsplash.com/photo-1567090981547-01af53b23a7e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//     description : "This is a nice campground"
// }, function (err, campground) {
//     if (err) {
//         console.log(err)
//     } else {
//         console.log(campground)
//     }
// });

// var campgrounds = [
//     { name: "Campground 1", image: "https://images.unsplash.com/photo-1567206848494-680aa0e4477e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80" },
//     { name: "Campground 2", image: "https://images.unsplash.com/photo-1567090981547-01af53b23a7e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" },
//     { name: "Campground 3", image: "https://images.unsplash.com/photo-1567206848494-680aa0e4477e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80" },
//     { name: "Campground 4", image: "https://images.unsplash.com/photo-1567090981547-01af53b23a7e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" },
//     { name: "Campground 5", image: "https://images.unsplash.com/photo-1567206848494-680aa0e4477e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80" },
//     { name: "Campground 6", image: "https://images.unsplash.com/photo-1567090981547-01af53b23a7e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" }
// ]

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
            res.render("index", { campgrounds: allCampgrounds })
        }
    })
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

// NEW ROUTE - Show form to create new campground
app.get("/campgrounds/new", function (req, res) {
    res.render("new.ejs");
})

// SHOW ROUTE - Show detailed information for the clicked campground
app.get("/campgrounds/:id", function (req, res) {
    //find the campground with the provided id
    var myId = req.params.id
    Campground.findById(myId, function (err, foundCampground) {
        if (err) {
            console.log(err)
        } else {
            //render show tempelate with that campground
            res.render("show", { campground: foundCampground });
        }
    })
})

app.listen(3000, function () {
    console.log("Server is running at 3000");
})