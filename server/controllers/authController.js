const User = require('../models/User');
const { generateToken } = require('../config/jwt');
const crypto = require('crypto');

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, college, studentId, course, year, role } = req.body;

    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email address.',
      });
    }

    const assignedRole = role && ['student', 'faculty'].includes(role) ? role : 'student';

    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password,
      college: college || 'CodeArena Institute of Technology',
      studentId: studentId || ('CA-' + Math.floor(100000 + Math.random() * 900000)),
      course: course || 'Computer Science & Engineering',
      year: year || '3rd Year',
      role: assignedRole,
      streakCount: 1,
      lastActiveDate: new Date(),
    });

    const token = generateToken({ id: user._id, role: user.role });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to CodeArena DSA.',
      token,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated by an administrator.',
      });
    }

    // Update streak if active today
    const now = new Date();
    const lastActive = new Date(user.lastActiveDate || now);
    const diffHours = Math.abs(now - lastActive) / 36e5;
    if (diffHours >= 20 && diffHours <= 48) {
      user.streakCount = (user.streakCount || 0) + 1;
    }
    user.lastActiveDate = now;
    await user.save();

    const token = generateToken({ id: user._id, role: user.role });

    res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, college, course, year, avatar } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (college) user.college = college;
    if (course) user.course = course;
    if (year) user.year = year;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: user.getPublicProfile(),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/auth/password
// @access  Private
const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password does not match.',
      });
    }

    user.password = newPassword;
    await user.save();

    const token = generateToken({ id: user._id, role: user.role });

    res.status(200).json({
      success: true,
      message: 'Password updated successfully.',
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email ? email.toLowerCase().trim() : '' });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If an account exists with that email, a password reset link/token has been generated.',
      });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 mins
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset token generated successfully. In development mode, use token below.',
      resetToken,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token.',
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const jwtToken = generateToken({ id: user._id, role: user.role });

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully. You are now logged in.',
      token: jwtToken,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Demo Credentials for quick development evaluation
// @route   GET /api/auth/demo-accounts
// @access  Public
const getDemoAccounts = async (req, res) => {
  res.status(200).json({
    success: true,
    accounts: [
      { role: 'admin', email: 'admin@codearena.com', password: 'Admin@123', label: 'Admin (Full System Control)' },
      { role: 'faculty', email: 'faculty@codearena.com', password: 'Faculty@123', label: 'Faculty / Examiner (Question & Exam Creator)' },
      { role: 'student', email: 'student@codearena.com', password: 'Student@123', label: 'Student (Exam Taker & Practice)' },
    ],
  });
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
  getDemoAccounts,
};
