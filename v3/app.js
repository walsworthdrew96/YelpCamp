var express			= require("express"),
		app					= express(),
		bodyParser	= require("body-parser"),
		mongoose		= require("mongoose"),
		Campground	= require("./models/campground"),
		seedDB			= require("./seeds");

mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

seedDB();

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
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
		if(err) {
			console.log(err);
		} else {
			console.log(foundCampground);
			//	Render SHOW template with that Campground
			// console.log("Campground found by id: ", req.params.id);
			res.render("show", { campground: foundCampground });
		}
	});
});

app.listen(3000, process.env.PORT, process.env.IP, function() {
	console.log("The YelpCamp Server has started!");
});
