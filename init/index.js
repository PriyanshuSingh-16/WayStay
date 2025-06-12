//Initialises listing with the data 
const mongoose=require('mongoose');
const {Listing}=require("../models/listing.js")
const data=require("./data.js");

const database="mongodb://127.0.0.1:27017/WayStay"

async function main() 
{
    await mongoose.connect(database);
};

main()
.then((res) =>
{
    console.log("Connection established with database WayStay");
})
.catch((err) =>
{
    console.log("Failed to establish connection with database WayStay");
});

async function initialiseDB() 
{
    await Listing.deleteMany({});
    await Listing.insertMany(data);
};

initialiseDB()
.then((res) =>
{
    console.log("Successfully inserted data");
})
.catch((err) =>
{
    console.log(err);
});