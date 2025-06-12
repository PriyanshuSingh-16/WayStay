//Scjema for listings
const mongoose=require('mongoose');
const schema=mongoose.Schema;
const model=mongoose.model;

const reviewSchema=new schema(
{
    rating: 
    {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    message: 
    {
        type: String,
        trim: true
    }
}, 
{ 
    timestamps: true 
});

const Review=model("Review", reviewSchema);

module.exports=Review;