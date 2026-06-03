const mongoose = require('mongoose');

const AdminAdSchema = new mongoose.Schema(
    {
        adImageUrl: { type: String, required: true },
        adLinkUrl: { type: String, required: true },
        adTitle: { type: String, required: true },
        adDescription: { type: String, required: true }
    }
);

module.exports = mongoose.model('admin_ad', AdminAdSchema);