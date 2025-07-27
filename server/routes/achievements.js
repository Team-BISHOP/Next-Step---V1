const express = require('express');
const { Achievement } = require('../models/Achievement');
const Profile = require('../models/Profile');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/achievements/me
// @desc    Get current user's achievements
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const achievements = await Achievement.find({ user: req.user._id })
      .sort({ earnedAt: -1 });

    res.json(achievements);
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/achievements/user/:userId
// @desc    Get user achievements by ID
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const achievements = await Achievement.find({ user: req.params.userId })
      .sort({ earnedAt: -1 });

    res.json(achievements);
  } catch (error) {
    console.error('Get user achievements error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/achievements/templates
// @desc    Get all achievement templates (for UI display)
// @access  Public
router.get('/templates', async (req, res) => {
  try {
    const { achievementTemplates } = require('../models/Achievement');
    
    // If user is authenticated, mark which achievements they've earned
    let userAchievements = [];
    if (req.user) {
      userAchievements = await Achievement.find({ user: req.user._id });
    }

    const templatesWithStatus = achievementTemplates.map(template => ({
      ...template,
      earned: userAchievements.some(ua => ua.title === template.title),
      earnedDate: userAchievements.find(ua => ua.title === template.title)?.earnedAt
    }));

    res.json(templatesWithStatus);
  } catch (error) {
    console.error('Get achievement templates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
