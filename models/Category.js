// models/Category.js
import mongoose, { Schema, model, models } from 'mongoose';

// Define the Category Schema
const CategorySchema = new Schema({
    name: { type: String, required: true },
    parent: { type: Schema.Types.ObjectId, ref: 'Category' }, 
    properties: [{
        name: { type: String, required: true },
        values: [{ type: String }], // Array of strings for values, e.g., ["red", "blue"]
    }],
}, {
    timestamps: true,
});


export const Category = models.Category || model('Category', CategorySchema);
