var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");


//INDEX CAMPGROUNDS PAGE - SHOW ALL CAMPGROUNDS
router.get("/", function(req, res) {

    Campground.find({}, function(err, allcampgrounds) {
        if (err) {
            console.log("ERROR");
        } else {
            res.render("campgrounds/index", { campgrounds: allcampgrounds });
        }
    })
});

// CREATE FORM PAGE -- TO ADD NEW CAMPGROUNDS
router.post("/", middleware.isLoggedIn, function(req, res) {

    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = { name: name, price: price, image: image, description: desc, author: author };
    // Create a new campground and save to db
    Campground.create(newCampground, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    })
});

// NEW CAMPGROUND ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});


// SHOW ROUTE
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundCampground)
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        res.render("campgrounds/edit", { campground: foundCampground });
    });
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Successfully Updated!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
    //redirect to show 
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;