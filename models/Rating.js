// models/Rating.js
import mongoose, { Schema, models, model } from "mongoose";

const RatingSchema = new Schema({
    product: {type: mongoose.Types.ObjectId, ref: 'Product', required: true},
    user: {type: mongoose.Types.ObjectId, ref: 'Client', required: true},
    stars: {type: Number, required: true, min: 1, max: 5},
}, {
    timestamps: true,
});

export const Rating = models.Rating || model('Rating', RatingSchema);
