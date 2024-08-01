// routes/admin.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const Testimonial = require('../models/testimonial');
const adminMiddleware = require('../middleware/admin');


module.exports = (upload) => {
    // Admin panel main page
    router.get('/', adminMiddleware, async (req, res) => {
        const testimonials = await Testimonial.find();
        res.render('admin', { testimonials });
    });

    // Handle testimonial upload
    router.post('/upload', adminMiddleware, upload.fields([{ name: 'beforeImage' }, { name: 'afterImage' }]), async (req, res) => {
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

    // Handle update description 
    
    router.post('/update/:id', adminMiddleware, async (req, res) => {
        const { id } = req.params;
        const { description } = req.body;
        const testimonial = await Testimonial.findById(id);
    
        if (testimonial) {
            testimonial.description = description;
            await testimonial.save();
            req.flash('success', 'Testimonial description updated successfully.');
        } else {
            req.flash('error', 'Testimonial not found.');
        }
    
        res.redirect('/admin');
    });

    // Handle testimonial deletion
    router.post('/delete/:id', adminMiddleware, async (req, res) => {
        const { id } = req.params;
        const testimonial = await Testimonial.findById(id);

        if (testimonial) {
            // Delete images from filesystem
            fs.unlinkSync(path.join(__dirname, '..', 'public', 'uploads', testimonial.beforeImage));
            fs.unlinkSync(path.join(__dirname, '..', 'public', 'uploads', testimonial.afterImage));

            // Delete testimonial from database
            await Testimonial.findByIdAndDelete(id);
        }

        res.redirect('/admin');
    });

    return router;
};
