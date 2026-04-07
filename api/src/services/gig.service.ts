import {GigRepository} from "../repositories/gig.repository.js";

export class GigService {

    gigRepository:GigRepository;
    constructor(){
        this.gigRepository = new GigRepository();
    }



}