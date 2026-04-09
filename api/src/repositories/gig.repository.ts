import {BaseRepository} from "./base.repository.js";
import {IGig} from "@/domain/interfaces/gig.interface.js";
import gigModel from "@/domain/entities/GigModel.js";



export class GigRepository extends BaseRepository<IGig> {

    constructor() {
        super(gigModel, "Gig");
    }
}