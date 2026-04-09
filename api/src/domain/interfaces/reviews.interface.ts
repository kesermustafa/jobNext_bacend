import { Document, Types } from "mongoose";

export interface IReviews extends Document{

    review:string,
    rating:number,
    user:Types.ObjectId,
    gig:Types.ObjectId


}