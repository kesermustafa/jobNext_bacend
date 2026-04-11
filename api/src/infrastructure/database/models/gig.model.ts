import {Schema, model} from "mongoose";

const gigSchema = new Schema(
    {
        user: {type: Schema.ObjectId, ref: "User"},
        title: {type: String, required: true, trim: true},
        description: String,
        reviewCount: {type: Number, default: 0},
        starCount: {type: Number, default: 0},
        category: String,
        coverImage: String,
        images: [String],
        packageTitle: String,
        packageDescription: String,
        packagePrice: Number,
        packageFeatures: [String],
        packageDuration: Number,
        packageRevisions: Number,
    },
    {timestamps: true, autoIndex: true}
);

export const GigModel = model("Gig", gigSchema);