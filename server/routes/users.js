const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Profile = require('../models/Profile');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/me
// @desc    Get current user info
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/me
// @desc    Update current user info
// @access  Private
router.put('/me', [
  auth,
  body('fullName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { fullName, email } = req.body;
    const user = await User.findById(req.user._id);

    if (fullName !== undefined) {
      user.fullName = fullName;
    }

    if (email !== undefined && email !== user.email) {
      // Check if email is already taken
      const existingUser = await User.findOne({ email, _id: { $ne: user._id } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already taken' });
      }
      user.email = email;
      user.isVerified = false; // Reset verification if email changed
    }

    await user.save();

    res.json({
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/users/me
// @desc    Deactivate current user account
// @access  Private
router.delete('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.isActive = false;
    await user.save();

    res.json({ message: 'Account deactivated successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/stats
// @desc    Get platform statistics
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isActive: true });
    const totalStudents = await User.countDocuments({ role: 'student', isActive: true });
    const totalExperts = await User.countDocuments({ role: 'industry_expert', isActive: true });
    
    const totalProfiles = await Profile.countDocuments();
    const completedProfiles = await Profile.countDocuments({
      $or: [
        { university: { $exists: true, $ne: '' } }, // Students with university
        { company: { $exists: true, $ne: '' } } // Experts with company
      ]
    });

    const totalPoints = await Profile.aggregate([
      { $group: { _id: null, totalPoints: { $sum: '$points' } } }
    ]);

    const topSkills = await Profile.aggregate([
      { $unwind: '$skills' },
      { $group: { _id: '$skills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      users: {
        total: totalUsers,
        students: totalStudents,
        experts: totalExperts
      },
      profiles: {
        total: totalProfiles,
        completed: completedProfiles,
        completionRate: totalProfiles > 0 ? Math.round((completedProfiles / totalProfiles) * 100) : 0
      },
      points: {
        total: totalPoints[0]?.totalPoints || 0,
        average: totalUsers > 0 ? Math.round((totalPoints[0]?.totalPoints || 0) / totalUsers) : 0
      },
      topSkills: topSkills.map(skill => ({
        name: skill._id,
        count: skill.count
      }))
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
