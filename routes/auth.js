// routes/auth.js
const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const router = express.Router();

// Register
router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingAdmin = await User.findOne({ isAdmin: true });
        const isAdmin = !existingAdmin; // First registered user is the admin
        
        const newUser = new User({ email, password, isAdmin });
        await newUser.save();
        
        req.flash('success', 'Registration successful. Please log in.');
        res.redirect('/auth/login');
    } catch (error) {
        req.flash('error', 'Error registering user.');
        res.redirect('/auth/register');
    }
});

// Login
router.get('/login', (req, res) => {
    res.render('login', { message: req.flash('error') });
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/auth/login',
    failureFlash: true
}));

// Logout route
router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) {
            return next(err);
        }
        req.flash('success_msg', 'You have logged out');
        res.redirect('/auth/login');
    });
});

module.exports = router;
