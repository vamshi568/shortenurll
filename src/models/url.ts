import mongoose from "mongoose";
//definig the schema for the url
const UrlSchema = new mongoose.Schema({
    originalUrl: { type: String, required: true },
    shortId: { type: String, required: true, unique: true },
    expirationDate: { type: Date, required: true },
    requestCount: { type: Number, default: 0 },
  });
  
  export const Url = mongoose.model("Url", UrlSchema);
  