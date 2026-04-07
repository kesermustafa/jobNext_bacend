import {BaseRepository} from "./base.repository.js";
import {IReviews} from "../interface/reviews.interface.js";
import reviews from "../models/ReviewsModel.js";


export class ReviewsRepository extends BaseRepository<IReviews>{

    constructor() {
        super(reviews, 'Reviews');
    }



}