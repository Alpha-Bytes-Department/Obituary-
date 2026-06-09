const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    memorialId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Memorial",
      required: true,
    },
    memorialName: {
      type: String,
      default: "",
    },
    donorName: {
      type: String,
      required: true,
      trim: true,
    },
    donorEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    currency: {
      type: String,
      default: "USD",
    },
    message: {
      type: String,
      default: "",
    },
    stripePaymentIntentId: {
      type: String,
      unique: true,
      sparse: true, // allows null/undefined without uniqueness conflicts
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);
