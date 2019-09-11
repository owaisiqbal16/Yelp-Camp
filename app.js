var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    app = express(),
    Campground = require("./models/campground"), //can use any name rather than campground
    Comment = require("./models/comment"),
    seedDB = require("./seeds"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    User = require("./models/user")

var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes = require('./routes/comments'),
    indexRoutes = require('./routes/index');


// seedDB();  //Seed the database with fake data
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "this is yelp camp",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));  //User.authenticate() comes with passport-local-mongoose
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Below defined is a middleware which helps us to pass the variable currentUser to every page we rendered below
//and we don't have to pass it separately in all the route functions like
//res.render("campgrounds/index", { currentUser : req.user })
//req.user contains information about the user only if logged in.. otherwise it's undefined
//we used this info in the header to display related links.
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

// =============
// R O U T I N G
// =============

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes); //all campgroundRoutes would start with /campgrounds/blah blah
app.use(commentRoutes);


app.listen(3000, function () {
    console.log("Server is running at 3000");
})