// routes/admin.js
const express = require('express');
const router = express.Router();
const Testimonial = require('../models/testimonial');

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/login');
}

module.exports = (upload) => {
    // Admin panel main page
    router.get('/', ensureAuthenticated, (req, res) => {
        res.render('admin');
    });

    // Handle testimonial upload
    router.post('/upload', ensureAuthenticated, upload.fields([{ name: 'beforeImage' }, { name: 'afterImage' }]), async (req, res) => {
        const { description } = req.body;
        const beforeImage = req.files.beforeImage[0].filename;
        const afterImage = req.files.afterImage[0].filename;

        const newTestimonial = new Testimonial({
            beforeImage,
            afterImage,
            description
        });

        await newTestimonial.save();
        res.redirect('/admin');
    });

    return router;
};
