// models/Client.js
import { Schema, model, models } from "mongoose";

const ClientSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  friends: [{ type: Schema.Types.ObjectId, ref: "Client" }], // ✅ accepted friends
  friendRequests: [{ type: Schema.Types.ObjectId, ref: "Client" }], // ✅ incoming requests
}, { timestamps: true });

export const Client = models?.Client || model("Client", ClientSchema, "clients");
