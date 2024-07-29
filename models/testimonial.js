// models/testimonial.js
const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    beforeImage: String,
    afterImage: String,
    description: String,
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
