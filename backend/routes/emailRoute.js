// emailRoutes.js
const express = require('express');
const router = express.Router();
const SendEmail = require('../utils/sendEmail');
const User = require('../models/userModel');
const crypto = require('crypto');

// Define a route for sending emails
router.post('/send-email', async (req, res) => {
  try {
    const { email, subject, message } = req.body;

    // Use the SendEmail function to send the email
    await SendEmail({ email, subject, message });

    // Respond with a success message
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
