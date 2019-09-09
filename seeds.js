var mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment");

var data = [
    {
        name: "Campground 1",
        image: "https://images.unsplash.com/photo-1567870104811-13daa89835cd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas porta placerat iaculis. Donec vestibulum maximus euismod. Phasellus maximus hendrerit eros, et auctor magna. Etiam nec rhoncus diam. Donec mi nisl, tempor faucibus mauris eget, faucibus rhoncus libero. Mauris ut turpis purus. Phasellus in pretium eros. Proin metus dui, varius ac orci vel, mattis mattis diam. Vestibulum semper arcu sit amet scelerisque efficitur. Cras vehicula massa dolor, quis sodales libero consequat nec. Aliquam at interdum arcu. Quisque sollicitudin libero sed urna blandit convallis. In viverra ex ipsum, a gravida diam tincidunt a. Fusce sagittis venenatis enim sit amet auctor. Maecenas et vestibulum orci. Vestibulum vitae suscipit lorem. Vivamus mauris ex, iaculis sit amet finibus a, cursus sit amet metus. Pellentesque sed ullamcorper felis. Donec ac ipsum eu lorem tristique venenatis. Fusce lobortis ultricies luctus."
    },
    {
        name: "Campground 2",
        image: "https://images.unsplash.com/photo-1567870104811-13daa89835cd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas porta placerat iaculis. Donec vestibulum maximus euismod. Phasellus maximus hendrerit eros, et auctor magna. Etiam nec rhoncus diam. Donec mi nisl, tempor faucibus mauris eget, faucibus rhoncus libero. Mauris ut turpis purus. Phasellus in pretium eros. Proin metus dui, varius ac orci vel, mattis mattis diam. Vestibulum semper arcu sit amet scelerisque efficitur. Cras vehicula massa dolor, quis sodales libero consequat nec. Aliquam at interdum arcu. Quisque sollicitudin libero sed urna blandit convallis. In viverra ex ipsum, a gravida diam tincidunt a. Fusce sagittis venenatis enim sit amet auctor. Maecenas et vestibulum orci. Vestibulum vitae suscipit lorem. Vivamus mauris ex, iaculis sit amet finibus a, cursus sit amet metus. Pellentesque sed ullamcorper felis. Donec ac ipsum eu lorem tristique venenatis. Fusce lobortis ultricies luctus."
    },
    {
        name: "Campground 3",
        image: "https://images.unsplash.com/photo-1567870104811-13daa89835cd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas porta placerat iaculis. Donec vestibulum maximus euismod. Phasellus maximus hendrerit eros, et auctor magna. Etiam nec rhoncus diam. Donec mi nisl, tempor faucibus mauris eget, faucibus rhoncus libero. Mauris ut turpis purus. Phasellus in pretium eros. Proin metus dui, varius ac orci vel, mattis mattis diam. Vestibulum semper arcu sit amet scelerisque efficitur. Cras vehicula massa dolor, quis sodales libero consequat nec. Aliquam at interdum arcu. Quisque sollicitudin libero sed urna blandit convallis. In viverra ex ipsum, a gravida diam tincidunt a. Fusce sagittis venenatis enim sit amet auctor. Maecenas et vestibulum orci. Vestibulum vitae suscipit lorem. Vivamus mauris ex, iaculis sit amet finibus a, cursus sit amet metus. Pellentesque sed ullamcorper felis. Donec ac ipsum eu lorem tristique venenatis. Fusce lobortis ultricies luctus."
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