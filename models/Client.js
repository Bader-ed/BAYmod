import {model, models, Schema} from "mongoose";

const ClientSchema = new Schema({
  name: {type: String},
  email: {type: String, required: true, unique: true},
  image: {type: String},
}, {
  timestamps: true,
});

export const Client = models?.Client || model('Client', ClientSchema);
