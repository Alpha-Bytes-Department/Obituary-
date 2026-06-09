const mongoose = require('mongoose');

const CondolenceSchema = new mongoose.Schema(
    {
        memorialId: { type: mongoose.Schema.Types.ObjectId, ref: 'memorial', required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional if anonymous
        submitterEmail: { type: String, required: true },
        submitterName: { type: String, required: true },
        message: { type: String, required: true },
        type: {
            type: String,
            enum: ['flower', 'candle'],
            default: 'flower'
        }
    },
    { timestamps: true }
);

// Enforce unique email per memorial
CondolenceSchema.index({ memorialId: 1, submitterEmail: 1 }, { unique: true });

module.exports = mongoose.model('Condolence', CondolenceSchema);
