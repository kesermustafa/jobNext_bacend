import mongoose, {Schema, Types} from "mongoose";
import {IReviews} from "../interface/reviews.interface.js";

const reviewsSchema = new Schema<IReviews>({

    review:{
        Type:String,
    },

    rating:{
        Type:Number,
    },

    user:{
        Type:Types.ObjectId,
    },

    gig:{
        Type:Types.ObjectId,
    }


})

const Reviews = mongoose.model<IReviews>("Reviews", reviewsSchema )

export default Reviews;