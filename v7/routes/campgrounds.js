var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

//INDEX ROUTE - View all Campgrounds
router.get("/", function(req, res) {
	// Get all campgrounds from DB.
	Campground.find({}, function(err, allCampgrounds) {
		if(err) {
			console.log(err);
		} else {
			res.render("./campgrounds/index", { campgrounds: allCampgrounds });
		}
	});
});

//CREATE ROUTE - Add new Campground to DB
router.post("/", function(req, res) {
	//	Get data from form and add to campgrounds array.
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCampground = { name: name, image: image, description: desc }
	//	Create a new Campground and save to DB
	Campground.create(newCampground, function(err, campground) {
		if(err) {
			console.log(err);
		} else {
			console.log("Created new Campground: ", campground);
			//	Redirect back to campgrounds page.
			res.redirect("/campgrounds");
		}
	});
});

//NEW ROUTE - Show form to create new Campground
router.get("/new", function(req, res) {
	res.render("./campgrounds/new");
});

//SHOW ROUTE - 
router.get("/:id", function(req, res) {
	//	Find the Campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
		if(err) {
			console.log(err);
		} else {
			//	Render SHOW template with that Campground
			// console.log("Campground found by id: ", req.params.id);
			res.render("./campgrounds/show", { campground: foundCampground });
		}
	});
});

module.exports = router;