const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { signAccessToken, signRefreshToken } = require('../utils/jwt');
const router = express.Router();

// Helper function to validate strong password
const isStrongPassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
};

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    // Validate Gmail only
    if (!email.toLowerCase().endsWith('@gmail.com')) {
      return res.status(400).json({ error: 'Only Gmail addresses (@gmail.com) are allowed' });
    }

    // Validate password strength
    if (!isStrongPassword(password)) {
      return res.status(400).json({ 
        error: 'Password must be at least 8 characters and contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character' 
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const SALT_ROUNDS = 12;
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: 'user',
      status: 'APPROVED',
      emailVerified: false,
    });

    // Generate email verification token (optional)
    const verificationToken = user.createEmailVerificationToken();
    await user.save();

    res.status(201).json({
      message: 'Signup successful. Please check your email to verify your account.',
      userId: user._id,
    });
  } catch (error) {
    console.error('Signup error:', error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];
      return res.status(409).json({ error: `${field} already exists` });
    }
    
    res.status(500).json({ error: 'Failed to signup. Please try again.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    // Validate Gmail only
    if (!email.toLowerCase().endsWith('@gmail.com')) {
      return res.status(400).json({ error: 'Only Gmail addresses (@gmail.com) are allowed' });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() })
      .select('+passwordHash +loginAttempts +lockUntil');

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > new Date()) {
      const remainingTime = Math.ceil((user.lockUntil.getTime() - Date.now()) / 60000);
      return res.status(429).json({ 
        error: `Too many login attempts. Account is locked. Try again after ${remainingTime} minutes.` 
      });
    }

    // Verify password
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      await user.incLoginAttempts();
      const attemptsLeft = 5 - (user.loginAttempts + 1);
      
      if (attemptsLeft <= 0) {
        return res.status(429).json({ 
          error: 'Too many failed login attempts. Account locked for 15 minutes.' 
        });
      }
      
      return res.status(401).json({ 
        error: `Invalid credentials. ${attemptsLeft} attempts remaining.` 
      });
    }

    // Check account status
    if (user.status !== 'APPROVED') {
      let message = 'Account not approved yet';
      if (user.status === 'REJECTED') message = 'Account has been rejected';
      if (user.status === 'SUSPENDED') message = 'Account has been suspended';
      
      return res.status(403).json({ error: message });
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    // Update last login info
    const clientIP = req.headers['x-forwarded-for'] || 
                     req.headers['x-real-ip'] || 
                     req.ip || 
                     'unknown';
    
    user.lastLoginAt = new Date();
    user.lastLoginIP = clientIP;
    await user.save();

    // Generate tokens
    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
      },
      accessToken,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login. Please try again.' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('refreshToken');
  res.status(200).json({ message: 'Logout successful' });
});

module.exports = router;
