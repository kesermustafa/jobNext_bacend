import {IGig} from "@/domain/interfaces/gig.interface.js";
import mongoose, {Schema} from "mongoose";


const gigSchema = new Schema<IGig>({

    name: {
        Type:String,
    }


});

const GigModel = mongoose.model<IGig>("Gig", gigSchema);

export default GigModel;