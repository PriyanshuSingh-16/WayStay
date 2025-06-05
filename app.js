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



// Start the Express server
app.listen(port, () => {
  console.log("App is running.");
});

app.get("/",(req,res)=>
{
    res.send("Hello ");
});

app.get("/testListing",async (req,res)=>
{
    let sampleListing=new Listing({
        title:"My new beach",
        description:"By the beach",
        price:1200,
        location:"Calcanguie,Goa",
        country:"India"
    });
    await sampleListing.save();
    console.log("Saved");
    res.send(sampleListing);
});





















