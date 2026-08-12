const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    type: { type: String, enum: ["rent", "sale"], required: true },
    category: {
      type: String,
      enum: ["apartment", "house", "villa", "plot", "commercial"],
      default: "apartment",
    },
    location: {
      city: { type: String, required: true },
      address: { type: String, required: true },
      state: { type: String, default: "" },
      zipCode: { type: String, default: "" },
    },
    images: [{ type: String }],
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    area: { type: Number, default: 0 }, // in sq ft
    amenities: [{ type: String }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["available", "sold", "rented"],
      default: "available",
    },
  },
  { timestamps: true }
);

propertySchema.index({ title: "text", "location.city": "text", description: "text" });

module.exports = mongoose.model("Property", propertySchema);
