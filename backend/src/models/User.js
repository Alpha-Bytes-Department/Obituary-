const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    refreshToken: { type: String },
    passwordChangedAt: { type: Date },
    profilePhotoUrl: { type: String },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
    tokenApplied: { type: Boolean, default: false },
    tokenApproveStatus: { type: Boolean, default: false },
    token: { type: String , unique:true, sparse: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);
