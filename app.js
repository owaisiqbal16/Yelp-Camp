var express = require('express');
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended : true }));
app.set("view engine", "ejs");

var campgrounds = [
    { name: "Campground 1" , image: "https://images.unsplash.com/photo-1567206848494-680aa0e4477e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80" },
    { name: "Campground 2" , image: "https://images.unsplash.com/photo-1567090981547-01af53b23a7e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" },
    { name: "Campground 3" , image: "https://images.unsplash.com/photo-1567206848494-680aa0e4477e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80" },
    { name: "Campground 4" , image: "https://images.unsplash.com/photo-1567090981547-01af53b23a7e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" },
    { name: "Campground 5" , image: "https://images.unsplash.com/photo-1567206848494-680aa0e4477e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80" },
    { name: "Campground 6" , image: "https://images.unsplash.com/photo-1567090981547-01af53b23a7e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" }
]

app.get("/", function(req,res){
    res.render("landing");
})

app.get("/campgrounds", function(req,res){

    res.render("campgrounds", {campgrounds:campgrounds});
})

app.get("/campgrounds/new", function(req,res){
    res.render("new.ejs");
})

app.post("/campgrounds", function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name : name , image : image};
    campgrounds.push(newCampground);

    res.redirect("/campgrounds");
})

app.listen(3000,function(){
    console.log("Server is running at 3000");
})