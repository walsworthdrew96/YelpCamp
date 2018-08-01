var express			= require("express"),
		app					= express(),
		bodyParser	= require("body-parser"),
		mongoose		= require("mongoose");

mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

// MODEL SETUP
var Campground = mongoose.model("Campground", campgroundSchema);

// ADD STARTER ENTRIES TO DATABASE
// // Create Entry 1
// Campground.create({
// 	name: "Salmon Creek", 
// 	image: "https://pixabay.com/get/eb3db30a29fd063ed1584d05fb1d4e97e07ee3d21cac104496f3c17ba4ecb4ba_340.jpg",
// 	description: "Salmon Creek is famous for its Salmon."
// }, function(err, campground) {
// 	if(err) {
// 		console.log(err);
// 	} else {
// 		console.log("Campground created: ", campground);
// 	}
// });

// // Create Entry 2
// Campground.create({
// 	name: "Granite Hill", 
// 	image: "https://pixabay.com/get/e83db3062df51c22d2524518b7444795ea76e5d004b0144296f0c37aa6ecb7_340.jpg",
// 	description: "A huge Granite Hill."
// }, function(err, campground) {
// 	if(err) {
// 		console.log(err);
// 	} else {
// 		console.log("Campground created: ", campground);
// 	}
// });

// // Create Entry 3
// Campground.create({
// 	name: "Mountain Goat's Rest", 
// 	image: "https://pixabay.com/get/e036b80a20fc1c22d2524518b7444795ea76e5d004b0144296f0c37aa6ecb7_340.jpg",
// 	description: "Mountain Goat's Rest."
// }, function(err, campground) {
// 	if(err) {
// 		console.log(err);
// 	} else {
// 		console.log("Campground created: ", campground);
// 	}
// });

app.get("/", function(req, res) {
	res.render("landing");
});

//INDEX ROUTE - View all Campgrounds
app.get("/campgrounds", function(req, res) {
	// Get all campgrounds from DB.
	Campground.find({}, function(err, allCampgrounds) {
		if(err) {
			console.log(err);
		} else {
			res.render("index", { campgrounds: allCampgrounds });
		}
	});
});

//CREATE ROUTE - Add new Campground to DB
app.post("/campgrounds", function(req, res) {
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
app.get("/campgrounds/new", function(req, res) {
	res.render("new");
});

//SHOW ROUTE - 
app.get("/campgrounds/:id", function(req, res) {
	//	Find the Campground with provided ID
	Campground.findById(req.params.id, function(err, foundCampground) {
		if(err) {
			console.log(err);
		} else {
			//	Render SHOW template with that Campground
			console.log("Campground found by id: ", req.params.id);
			res.render("show", { campground: foundCampground });
		}
	});
});

app.listen(3000, process.env.PORT, process.env.IP, function() {
	console.log("The YelpCamp Server has started!");
});
