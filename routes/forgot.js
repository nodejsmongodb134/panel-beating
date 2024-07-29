// routes/forgot.js
const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/user');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('forgot', { message: req.flash('error') });
});

router.post('/', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/forgot');
        }

        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            host:'smtp.gmail.com',
            port:587,
            secure:true,
            auth: {
                user: 'nodejsmongodb12@gmail.com',
                pass: 'pepvheejsxgymybq'
            },
            tls:{
                rejectUnauthorized:false
            }
        });

        const mailOptions = {
            to: user.email,
            from: 'passwordreset@demo.com',
            subject: 'Panel Beating Company Password Reset',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
                   Please click on the following link, or paste this into your browser to complete the process:\n\n
                   http://${req.headers.host}/reset/${token}\n\n
                   If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                console.error('Mail sending error:', err);
                req.flash('error', 'Error sending password reset email.');
                return res.redirect('/forgot');
            }
            req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
            res.redirect('/forgot');
        });
    } catch (err) {
        console.error('Error:', err);
        req.flash('error', 'Error processing your request.');
        res.redirect('/forgot');
    }
});

module.exports = router;
