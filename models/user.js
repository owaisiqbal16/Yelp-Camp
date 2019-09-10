var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    password : String
});

userSchema.plugin(passportLocalMongoose); //adds some methods in User

module.exports = mongoose.model("User",userSchema);