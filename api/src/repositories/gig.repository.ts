import {BaseRepository} from "./base.repository.js";
import {IGig} from "../interface/gig.interface.js";
import gigModel from "../models/GigModel.js";



export class GigRepository extends BaseRepository<IGig> {

    constructor() {
        super(gigModel, "Gig");
    }
}