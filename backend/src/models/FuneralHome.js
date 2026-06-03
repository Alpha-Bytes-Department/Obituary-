const mongoose = require('mongoose');
const FuneralHomeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        address: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true },
        website: { type: String },
        description: { type: String },
        logoImageUrl: { type: String ,required:true },
        userId:{type:String, required:true},
        MapLink:{type:String}
    },
    { timestamps: true }
);

module.exports = mongoose.model('FuneralHome', FuneralHomeSchema);