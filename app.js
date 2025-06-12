// Import required modules
const express = require("express");
const app = express();
const port = 4000;

const path = require("path");
const methodOverride = require("method-override");

// Set EJS as the templating engine
app.set("view engine", "ejs");
// Set the views directory
app.set("views", path.join(__dirname, "/views"));

// Serve static files (CSS, JS, images) from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));
// Middleware to parse incoming JSON data
app.use(express.json());

// Middleware to support PUT & DELETE methods in HTML forms using query parameter ?_method=PUT/DELETE
app.use(methodOverride('_method'));


// Import mongoose and connect to local MongoDB database named "whatsapp"
const mongoose = require('mongoose');

main()
  .then(() => {console.log("Connection Successful.");})
  .catch((err) => console.log(err));

// Async function to connect to MongoDB
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/WayStay');
}

const Listing=require("./models/listing.js");


const ejsMate=require("ejs-mate");
app.engine("ejs",ejsMate);




// Start the Express server
app.listen(port, () => {
  console.log("App is running.");
});

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

//Index Route
app.get("/listings", async (req, res) => {
  const data = await Listing.find({});
  res.render("listings/index.ejs", { data });
});

//New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const data = await Listing.findById(id);
  res.render("listings/show.ejs", {data});
});

//Create Route
app.post("/listings", async (req, res) => {
  const newListing = new Listing(req.body.Listing);
  await newListing.save();
  res.redirect("/listings");
});

//Edit Route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const chat = await Listing.findById(id);
  res.render("listings/edit.ejs", { chat });
});

//Update Route
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.Listing });
  res.redirect(`/listings/${id}`);
});

//Delete Route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
});

// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });


















