var mongoose = require("mongoose");

//Schema Setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});
//Making model with above schema

// var Campground = mongoose.model("Campground", campgroundSchema);
module.exports = mongoose.model("Campground", campgroundSchema);