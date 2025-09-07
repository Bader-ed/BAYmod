// models/Notification.js
import mongoose, { Schema, models, model } from "mongoose";

const NotificationSchema = new Schema({
    recipient: { type: mongoose.Types.ObjectId, ref: 'Client', required: true },
    sender: { type: mongoose.Types.ObjectId, ref: 'Client', required: true },
    type: { type: String, enum: ['friendRequest', 'mention'], required: true },
    relatedId: { type: mongoose.Types.ObjectId, required: true },
    isRead: { type: Boolean, default: false },
    product: { type: mongoose.Types.ObjectId, ref: 'Product' }, // Only for mentions
}, {
    timestamps: true,
});

export const Notification = models.Notification || model('Notification', NotificationSchema);
