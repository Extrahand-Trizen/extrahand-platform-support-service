const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const { signAccessToken, signRefreshToken } = require('../utils/jwt');
const { sendPasswordResetEmail } = require('../utils/email');
const router = express.Router();

const getFrontendBaseUrl = () => {
  const primaryUrl = process.env.FRONTEND_URL;
  if (primaryUrl) {
    return primaryUrl.trim().replace(/\/$/, '');
  }

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3004';
  const firstUrl = clientUrl
    .split(',')
    .map((url) => url.trim())
    .find(Boolean);

  return (firstUrl || 'http://localhost:3004').replace(/\/$/, '');
};

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

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    if (!email.toLowerCase().endsWith('@gmail.com')) {
      return res.status(400).json({ error: 'Only Gmail addresses (@gmail.com) are allowed' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    // Safety: always return success even if user doesn't exist
    if (!user) {
      return res.status(200).json({
        message: 'If your email is registered, you will receive a password reset link shortly.',
      });
    }

    // Generate token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Send email
    const resetURL = `${getFrontendBaseUrl()}/reset-password/${resetToken}`;

    try {
      await sendPasswordResetEmail(user.email, resetURL, user.name);
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError);
      // Still return success to client
    }

    res.status(200).json({
      message: 'If your email is registered, you will receive a password reset link shortly.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters and contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character'
      });
    }

    // Hash the token to compare with stored hashed token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    }).select('+passwordHash +resetPasswordToken +resetPasswordExpires');

    if (!user) {
      return res.status(400).json({ error: 'Password reset token is invalid or has expired' });
    }

    // Hash new password
    const SALT_ROUNDS = 12;
    user.passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // Reset login attempts if any
    user.loginAttempts = 0;
    user.lockUntil = undefined;

    await user.save();

    res.status(200).json({
      message: 'Password reset successful. You can now login with your new password.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

module.exports = router;
