const mongoose = require('mongoose');

const AdminAdSchema = new mongoose.Schema(
    {
        adImageUrl: { type: String, required: true },
        adLinkUrl: { type: String, required: true },
        adTitle: { type: String, required: true },
        adDescription: { type: String },
        placementType: {
            type: String,
            enum: ['featured', 'funeral_advice', 'special_row_1', 'special_row_2'],
            default: 'funeral_advice'
        },
        isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model('admin_ad', AdminAdSchema);