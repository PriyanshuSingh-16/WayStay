//Initialises listing with the data 
const mongoose=require('mongoose');
const Listing=require("../models/listing.js")
const data=require("./data.js");

const database="mongodb://127.0.0.1:27017/Windbnb"

async function main() 
{
    await mongoose.connect(database);
};

main()
.then((res) =>
{
    console.log("Connection established with database Windbnb");
})
.catch((err) =>
{
    console.log("Failed to establish connection with database WindBnb");
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
    console.log("Error inserting data");
});