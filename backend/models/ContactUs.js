const mongoose = require('mongoose');

const contactUsSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    school: { type: String },
    phone: { type: String },
    email: { type: String, required: true },
    message: { type: String },
    categories: {
        goshowcase: { type: Boolean, default: false },
        goshackathon: { type: Boolean, default: false },
        volunteer: { type: Boolean, default: false },
        sponsor: { type: Boolean, default: false },
        other: { type: Boolean, default: false }
    },
    otherAnswer: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('ContactUs', contactUsSchema);
