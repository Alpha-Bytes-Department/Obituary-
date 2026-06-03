const mongoose = require("mongoose");

const memorialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  deathDate: { type: Date, required: true },
  birthdate: { type: Date, required: true },
  location: { type: String, required: true },
  memorialDetails: { type: String, required: true },
  familyDetails: { type: String, required: true },
  lifeStory: { type: String, required: true },
  rememberForEverQuote: { type: String, required: true },
  favouriteQuote: { type: String, required: true },
  careerSummery: { type: String, required: true },
  funeralHomeLogo: { type: String, required: true },
  deadPersonPhoto: {
    type: [{ type: String, required: true }],
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
  familyTreeUrl: { type: String, required: true },
  status: { type: String, required: true },
  country: { type: String, required: true },
  submissionDate: { type: Date, required: true },
  UserId: { type: String, required: true },
});

module.exports = mongoose.model("memorial", memorialSchema);
