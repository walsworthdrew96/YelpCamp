var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

var campgrounds = [
		{name: "Salmon Creek", image: "https://pixabay.com/get/eb3db30a29fd063ed1584d05fb1d4e97e07ee3d21cac104496f3c17ba4ecb4ba_340.jpg"},
		{name: "Granite Hill", image: "https://pixabay.com/get/e83db3062df51c22d2524518b7444795ea76e5d004b0144296f0c37aa6ecb7_340.jpg"},
		{name: "Mountain Goat's Rest", image: "https://pixabay.com/get/e036b80a20fc1c22d2524518b7444795ea76e5d004b0144296f0c37aa6ecb7_340.jpg"},
	];

app.get("/", function(req, res) {
	res.render("landing");
});

app.get("/campgrounds", function(req, res) {
	res.render("campgrounds", { campgrounds: campgrounds });
});

app.post("/campgrounds", function(req, res) {
	//	Get data from form and add to campgrounds array.
	var name = req.body.name;
	var image = req.body.image;
	var newCampground = { name: name, image: image }
	campgrounds.push(newCampground);
	//	Redirect back to campgrounds page.
	res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res) {
	res.render("new");
});

app.listen(3000, process.env.PORT, process.env.IP, function() {
	console.log(`process.env.PORT = ${process.env.PORT}`);
	console.log(`process.env.IP = ${process.env.IP}`);
	console.log("The YelpCamp Server has started!");
});
