/**
 * routes/auth.js
 * Authentication routes:
 * - POST /signup           -> create user + send OTP to email
 * - POST /verify-otp       -> verify OTP and activate account
 * - POST /login            -> login (returns JWT)
 * - GET  /me               -> return user info (protected)
 *
 * This file also exports `authenticate` middleware to protect routes.
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Nodemailer transporter (configured by env vars)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// helper to send OTP email
async function sendOtpEmail(toEmail, otp) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'SmartBus <no-reply@smartbus.com>',
    to: toEmail,
    subject: 'Your SmartBus verification code',
    text: `Your verification code is ${otp}. It is valid for 15 minutes.`,
    html: `<p>Your verification code is <strong>${otp}</strong>. It is valid for 15 minutes.</p>`
  };

  return transporter.sendMail(mailOptions);
}

// Generate numeric OTP of length 6
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Middleware to protect routes (attach req.user)
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Invalid Authorization header format' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.user = decoded; // { id, email, name, role }
    next();
  });
}

/**
 * POST /api/auth/signup
 * Body: { name, email, password }
 * Creates a user (isVerified=false) and sends an OTP to email for verification.
 */
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'name, email and password are required' });

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes

    const newUser = await User.create({
      name,
      email,
      passwordHash,
      role: role === 'authority' ? 'authority' : 'passenger',
      isVerified: false,
      otp,
      otpExpires
    });

    // send OTP email (don't fail signup if mail fails, but log)
    try {
      await sendOtpEmail(email, otp);
    } catch (mailErr) {
      console.error('Failed to send OTP email:', mailErr);
      // Proceed — user can request OTP resend
    }

    res.json({ message: 'Signup successful. OTP sent to your email.', email: newUser.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

/**
 * POST /api/auth/verify-otp
 * Body: { email, otp }
 * Marks user as verified if OTP matches and not expired
 */
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'email and otp are required' });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.isVerified) return res.status(400).json({ error: 'User already verified' });

    if (!user.otp || !user.otpExpires) return res.status(400).json({ error: 'No OTP found, request a new one' });

    if (new Date() > user.otpExpires) return res.status(400).json({ error: 'OTP expired, request a new one' });

    if (user.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ message: 'Email verified. You can now log in.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during OTP verification' });
  }
});

/**
 * POST /api/auth/resend-otp
 * Body: { email }
 * Re-generate and resend OTP (useful if user didn't get mail or OTP expired)
 */
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'email is required' });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.isVerified) return res.status(400).json({ error: 'User already verified' });

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 1000 * 60 * 15);
    await user.save();

    try {
      await sendOtpEmail(email, otp);
    } catch (mailErr) {
      console.error('Failed to send OTP email:', mailErr);
    }

    res.json({ message: 'OTP resent to your email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during resend OTP' });
  }
});

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Returns JWT if successful (user must be verified)
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    if (!user.isVerified) return res.status(400).json({ error: 'Email not verified. Please verify using the OTP sent to your email.' });

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({
      token,
      user: payload
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

/**
 * GET /api/auth/me
 * Protected — returns current user info from token
 */
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role', 'isVerified', 'createdAt']
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error in /me' });
  }
});

module.exports = { router, authenticate };
