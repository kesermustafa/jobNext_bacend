import {ReviewsRepository} from "@/infrastructure/repositories/reviews.repository.js";

export class ReviewsService {

    private reviewsRepository: ReviewsRepository;

    constructor() {
        this.reviewsRepository = new ReviewsRepository();
    }


}