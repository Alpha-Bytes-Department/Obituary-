const mongoose = require("mongoose");

const memorialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  deathDate: { type: Date, required: true },
  birthdate: { type: Date, required: true },
  location: { type: String, required: true },
  memorialDetails: { type: String, required: true },
  memorialDetailVisibilityStatus: { type: Boolean, default: true },
  familyDetails: { type: String, required: true },
  familyDetailVisibilityStatus: { type: Boolean, default: true },
  lifeStory: { type: String, required: true },
  lifeStoryVisibilityStatus: { type: Boolean, default: true },
  rememberForEverQuote: { type: String, required: true },
  rememberForEverQuoteVisibilityStatus: { type: Boolean, default: true },
  favouriteQuote: { type: String, required: true },
  favouriteQuoteVisibilityStatus: { type: Boolean, default: true },
  careerSummery: { type: String, required: true },
  careerSummeryVisibilityStatus: { type: Boolean, default: true },
  funeralHomeLogo: { type: String, required: true },
  deadPersonPhoto: {
    type: [String],
    validate: {
      validator: function (photos) {
        return photos.length <= 20;
      },
      message: "deadPersonPhoto cannot have more than 20 items.",
    },
  },
  relationToDeceased: { type: String, required: true },
  funeralHomeDetails: {
    name: { type: String, required: true },
    website: { type: String },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    mapLink: { type: String, required: true },
  },
  funeralNotice: {
    serviceDate: { type: Date, required: true },
    serviceLocation: { type: String, required: true },
    serviceName: { type: String, required: true },
    serviceMapLink: { type: String, required: true },
    ReceptionDate: { type: Date, required: true },
    ReceptionLocation: { type: String, required: true },
    ReceptionName: { type: String, required: true },
    ReceptionMapLink: { type: String, required: true },
  },
  funeralHomeAdvertisement: [
    {
      adImage: { type: String, required: true },
      link: { type: String, required: true },
    },
  ],
  familyTreeDiagram: { type: String, required: true },
  country: { type: String, required: true },
  UserId: { type: String, required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  submittedAt: { type: Date, default: Date.now },
  publicationDate: { type: Date, default: null },
  rejectedReason: { type: String, default: null },
 
});

module.exports = mongoose.model("memorial", memorialSchema);
