// Import mongoose and connect to local MongoDB database named "whatsapp"
const mongoose = require('mongoose');

const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        default:"",
        type:String,
        set:(v)=>v===""?"https://pixabay.com/photos/man-mountains-peaks-snow-canada-9594075/": v,
    },
    price:Number,
    location:String,
    country:String,
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;
