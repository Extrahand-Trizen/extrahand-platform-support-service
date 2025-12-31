const express = require('express');
const ContactMessage = require('../models/ContactMessage');
const { authenticate, requireRole } = require('../middleware/auth');
const router = express.Router();

// POST /api/contact - Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Get client information
    const ipAddress = req.headers['x-forwarded-for'] || 
                     req.headers['x-real-ip'] || 
                     req.ip || 
                     'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    // Create contact message
    const contactMessage = await ContactMessage.create({
      name,
      email,
      subject,
      message,
      ipAddress,
      userAgent,
    });

    res.status(201).json({
      success: true,
      message: 'Your message has been received. We will respond within 24 hours.',
      id: contactMessage._id,
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to submit message. Please try again later.' });
  }
});

// GET /api/contact - Get all contact messages (admin only)
router.get('/', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;

    const query = status ? { status } : {};
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const messages = await ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await ContactMessage.countDocuments(query);

    res.json({
      success: true,
      data: messages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

module.exports = router;
