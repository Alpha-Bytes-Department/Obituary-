const mongoose = require("mongoose");
const FuneralHomeSchema = new mongoose.Schema(
  {
    name: { type: String },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
    website: { type: String },
    description: { type: String },
    logoImageUrl: { type: String },
    userId: { type: String, required: true },
    MapLink: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("FuneralHome", FuneralHomeSchema);
