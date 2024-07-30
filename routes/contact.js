// routes/contact.js
const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('contact', { message: null });
});

router.post('/', async (req, res) => {
    const { name, email, message } = req.body;

    // Configure the email transporter
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        host:'smtp.gmail.com',
        auth: {
            user: 'nodejsmongodb12@gmail.com', // Replace with your email
            pass: 'pepvheejsxgymybq',
            port:587,
            secure:true,
            },
            tls:{
                rejectUnauthorized:false
            }
        });

    const mailOptions = {
        from: email,
        to: 'nodejsmongodb12@gmail.com', // Replace with the email address you want to receive messages
        subject: `Contact form submission from ${name}`,
        text: message
    };

    try {
        await transporter.sendMail(mailOptions);
        res.render('contact', { message: 'Your message has been sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.render('contact', { message: 'An error occurred while sending your message. Please try again later.' });
    }
});

module.exports = router;
