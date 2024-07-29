// routes/testimonials.js
const express = require('express');
const router = express.Router();
const Testimonial = require('../models/testimonial');

module.exports = (upload) => {
    router.get('/', async (req, res) => {
        const testimonials = await Testimonial.find();
        res.render('testimonials', { testimonials });
    });

    router.get('/upload', (req, res) => {
        res.render('upload');
    });

    router.post('/upload', upload.fields([{ name: 'beforeImage' }, { name: 'afterImage' }]), async (req, res) => {
        const { description } = req.body;
        const beforeImage = req.files.beforeImage[0].filename;
        const afterImage = req.files.afterImage[0].filename;

        const newTestimonial = new Testimonial({
            beforeImage,
            afterImage,
            description
        });

        await newTestimonial.save();
        res.redirect('/testimonials');
    });

    return router;
};
