const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
  {
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["pending", "replied"], default: "pending" },
    reply: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inquiry", inquirySchema);
