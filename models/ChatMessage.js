// models/ChatMessage.js
import mongoose, { Schema, models, model } from "mongoose";

const ChatMessageSchema = new Schema({
    product: { type: mongoose.Types.ObjectId, ref: 'Product', required: true },
    user: { type: mongoose.Types.ObjectId, ref: 'Client', required: true },
    message: { type: String, required: true },
    mentionedUsers: [{ type: mongoose.Types.ObjectId, ref: 'Client' }], // A new field to store IDs of mentioned users
}, {
    timestamps: true,
});

export const ChatMessage = models.ChatMessage || model('ChatMessage', ChatMessageSchema);
