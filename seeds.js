var mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment");

var data = [
    {
        name: "Campground 1",
        image: "https://images.unsplash.com/photo-1567870104811-13daa89835cd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "blah blah blah"
    },
    {
        name: "Campground 2",
        image: "https://images.unsplash.com/photo-1567870104811-13daa89835cd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "blah blah blah"
    },
    {
        name: "Campground 3",
        image: "https://images.unsplash.com/photo-1567870104811-13daa89835cd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "blah blah blah"
    }
]

function seedDB() {
    //Remove all campgrounds
    Campground.remove({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log("Removed Campgrounds");
        //Add new campgrounds
        data.forEach(function (seed) {
            Campground.create(seed, function (err, campground) {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log("added a campground");
                    //Create comments for this campground
                    Comment.create({
                        text: "Hey it's cool",
                        author: "John Doe"
                    }, function (err, comment) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            campground.comments.push(comment);
                            campground.save();
                            console.log("created a new comment");
                        }
                    })
                }
            })
        })
    });
}

module.exports = seedDB;