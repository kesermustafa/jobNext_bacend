import {BaseRepository} from "./base.repository.js";
import {IReviews} from "@/domain/interfaces/reviews.interface.js";
import reviews from "@/domain/entities/ReviewsModel.js";


export class ReviewsRepository extends BaseRepository<IReviews>{

    constructor() {
        super(reviews, 'Reviews');
    }



}