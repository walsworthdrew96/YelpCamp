var express				= require("express"),
		app						= express(),
		bodyParser		= require("body-parser"),
		mongoose			= require("mongoose"),
		passport			= require("passport"),
		LocalStrategy	= require("passport-local"),
		Campground		= require("./models/campground"),
		Comment				= require("./models/comment"),
		User					= require("./models/user"),
		seedDB				= require("./seeds");

mongoose.connect("mongodb://localhost:27017/yelp_camp_v6", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

//	PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Secret string.",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	next();
});

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

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
	//find campground by id
	Campground.findById(req.params.id, function(err, campground) {
		if(err) {
			console.log(err);
		} else {
			res.render("./comments/new", { campground: campground });
		}
	});
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {
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

//===============
//	AUTH ROUTES
//===============

//show register form
app.get("/register", function(req, res) {
	res.render("register");
});

//handle sign up logic
app.post("/register", function(req, res) {
	var newUser = new User({ username: req.body.username })
	User.register(newUser, req.body.password, function(err, user) {
		if(err) {
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function() {
			res.redirect("/campgrounds");
		});
	});
});

//show login form
app.get("/login", function(req, res) {
	res.render("login");
});

//handle login logic
app.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), function(req, res) {});

//logout route
app.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/campgrounds");
});

//middleware
function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

app.listen(3000, process.env.PORT, process.env.IP, function() {
	console.log("The YelpCamp Server has started!");
});
