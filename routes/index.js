var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", function (req, res) {
    res.render("landing");
})


//===================
//AUTH ROUTES
//===================

//show register form
router.get("/register", function (req, res) {
    res.render("register");
})

//handle signup logic
router.post("/register", function (req, res) {
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
router.get('/login', function (req, res) {
    res.render("login");
})

//handle login logic

//passport.authenticate is a middleware to check the authentication which we setup above (LocalStrategy(User.authenticate()))
//This middleware will take req.body.username and password and authenticate the password with the one stored in databse
//app.post("/login",middleware,callback)
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }) , function (req, res) {

    });

// Logout route
router.get("/logout" , function(req,res){
    req.logout();
    res.redirect("/campgrounds");
})    

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;