var express			= require("express"),
		app					= express(),
		bodyParser	= require("body-parser"),
		mongoose		= require("mongoose"),
		Campground	= require("./models/campground"),
		Comment			= require("./models/comment"),
		seedDB			= require("./seeds");

mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
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
			res.render("./campgrounds/index", { campgrounds: allCampgrounds });
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
	res.render("./campgrounds/new");
});

//SHOW ROUTE - 
app.get("/campgrounds/:id", function(req, res) {
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

//=================
// COMMENTS ROUTES
//=================

app.get("/campgrounds/:id/comments/new", function(req, res) {
	//find campground by id
	Campground.findById(req.params.id, function(err, campground) {
		if(err) {
			console.log(err);
		} else {
			res.render("./comments/new", { campground: campground });
		}
	});
});

app.post("/campgrounds/:id/comments", function(req, res) {
	//look up campground using id
	Campground.findById(req.params.id, function(err, campground) {
		if(err) {
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			//create new comment
			Comment.create(req.body.comment, function(err, comment) {
				if(err) {
					console.log(err);
				} else {
					//connect new comment to campground
					campground.comments.push(comment);
					campground.save();
					//redirect to campground show page
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

app.listen(3000, process.env.PORT, process.env.IP, function() {
	console.log("The YelpCamp Server has started!");
});
