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


seedDB();
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
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

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
            res.render("campgrounds/index", { campgrounds: allCampgrounds , currentUser : req.user })
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
app.get("/campgrounds/:id/comments/new", isLoggedIn , function (req, res) {
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
app.post("/campgrounds/:id/comments", isLoggedIn, function (req, res) {
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

//===================
//AUTH ROUTES
//===================

//show register form
app.get("/register", function (req, res) {
    res.render("register");
})

//handle signup logic
app.post("/register", function (req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) { //User.register came from passport-local-mongoose
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function () {  //logging user in after signup
            res.redirect("/campgrounds");
        })
    })
})

//show login form
app.get('/login', function (req, res) {
    res.render("login");
})

//handle login logic

//passport.authenticate is a middleware to check the authentication which we setup above (LocalStrategy(User.authenticate()))
//This middleware will take req.body.username and password and authenticate the password with the one stored in databse
//app.post("/login",middleware,callback)
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }) , function (req, res) {

    });

// Logout route
app.get("/logout" , function(req,res){
    req.logout();
    res.redirect("/campgrounds");
})    

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.listen(3000, function () {
    console.log("Server is running at 3000");
})