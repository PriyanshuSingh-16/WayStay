const express=require("express");
const app=express();
const path=require("path");
const port=8080;
const mongoose=require('mongoose');
const database="mongodb://127.0.0.1:27017/WayStay"
const {Listing, listSchema}=require("./models/listing.js");
const Review=require("./models/review.js");
const methodOverride=require('method-override');
const wrapAsync=require("./utilities/wrapAsync.js");
const expressError=require("./utilities/expressError.js");
const {listingSchema, reviewSchema}=require("./schema.js");
const engine=require("ejs-mate");

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.engine('ejs', engine);
app.use(methodOverride('_method'));

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

function validateListing(req, res, next)
{
    const {error}=listingSchema.validate(req.body);
    if(error) 
    {
        let errMessage=error.details.map((el) => el.message).join(", ");
        throw new expressError("404", errMessage);
    }
    else next();
};

function validateReview(req, res, next)
{
    const {error}=reviewSchema.validate(req.body);
    if(error) 
    {
        let errMessage=error.details.map((el) => el.message).join(", ");
        throw new expressError("404", errMessage);
    }
    else next();
}

app.listen(port, () =>
{
    console.log(`Listening on port: ${port}`);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.get('/', wrapAsync( async (req, res, next) => 
{
    const data=await Listing.find();
    res.render("listing/home.ejs", {title: "Home | Windbnd", data});
}));

app.get('/listing/:id/show', wrapAsync(async (req, res) => 
{
    const {id}=req.params;
    const data=await Listing.findById(id).populate('reviews');
    if(!data) return res.status(404).send("Listing not found");
    res.render("listing/show.ejs", {title: `${data.title}`, data});
}));

app.get("/listing/new", (req, res) =>
{
    res.render("listing/new.ejs", {title: "New Location"});
});

app.post("/listing/new", validateListing, wrapAsync(async (req, res) =>
{
    const newListing=new Listing(req.body.Listing);
    await newListing.save();
    res.redirect("/");
}));

listSchema.pre('findOneAndDelete', 
async function(next) 
{
    const filter = this.getFilter();
    const toBeDeleted = await this.model.findOne(filter);
    if(!toBeDeleted) throw new expressError(400, "Listing not found");
    await Review.deleteMany(
    {
        _id: { $in: toBeDeleted.reviews }
    });
});


app.delete("/listing/:id/delete", wrapAsync(async (req, res) =>
{
    const {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/");
}));

app.get("/listing/:id/edit", wrapAsync(async (req, res) =>
{
    const {id}=req.params;
    const chat=await Listing.findById(id);
    res.render("listing/edit.ejs", {title: "Edit | chat.title", chat});
}));

app.patch("/listing/:id/edit", validateListing, wrapAsync(async (req, res) =>
{
    const {id}=req.params;
    const newListing=new Listing(req.body.Listing);
    await newListing.save();
    res.redirect("/");
}));

app.post("/listing/:id/review", validateReview, wrapAsync(async (req, res) =>
{
    const {id}=req.params;
    const newReview=new Review(req.body.Review);
    await newReview.save();
    const listing=await Listing.findById(id);
    listing.reviews.push(newReview._id);
    await listing.save();
    res.redirect(`/listing/${id}/show`); 
}));

app.delete("/listing/:id/review/:reviewId", wrapAsync(async (req, res) =>
{
    const {id, reviewId}=req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, {$pull: {reviews:reviewId}});
    res.redirect(`/listing/${id}/show`);
}));

app.use((req, res, next) => {
    next(new expressError(404, "Page does not exist"));
});

app.use((err, req, res, next) =>
{
    const {status=500, message="Unknown error occured"}=err;
    res.render("listing/error.ejs", {title: "Error", status, message});
});