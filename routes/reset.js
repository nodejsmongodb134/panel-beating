// routes/reset.js
const express = require('express');
const User = require('../models/user');
const router = express.Router();

router.get('/:token', async (req, res) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/forgot');
        }
        res.render('reset', { token: req.params.token });
    } catch (err) {
        console.error('Error:', err);
        req.flash('error', 'Error processing your request.');
        res.redirect('/forgot');
    }
});

router.post('/:token', async (req, res) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/forgot');
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        req.flash('success', 'Success! Your password has been changed.');
        res.redirect('/auth/login');
    } catch (err) {
        console.error('Error:', err);
        req.flash('error', 'Error processing your request.');
        res.redirect('/forgot');
    }
});

module.exports = router;
