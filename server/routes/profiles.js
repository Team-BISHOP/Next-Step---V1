const express = require('express');
const { body, validationResult } = require('express-validator');
const Profile = require('../models/Profile');
const User = require('../models/User');
const Activity = require('../models/Activity');
const { Achievement, achievementTemplates } = require('../models/Achievement');
const { auth, authorize, optional } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/profiles/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id })
      .populate('user', 'fullName email role createdAt');

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/profiles/me
// @desc    Update current user's profile
// @access  Private
router.put('/me', [
  auth,
  body('university').optional().trim().isLength({ max: 100 }),
  body('yearOfStudy').optional().isInt({ min: 1, max: 7 }),
  body('major').optional().trim().isLength({ max: 100 }),
  body('skills').optional().isArray(),
  body('careerInterests').optional().isArray(),
  body('githubUsername').optional().trim().isLength({ max: 50 }),
  body('linkedinUrl').optional().trim().isURL().withMessage('LinkedIn URL must be valid'),
  body('company').optional().trim().isLength({ max: 100 }),
  body('position').optional().trim().isLength({ max: 100 }),
  body('industry').optional().trim().isLength({ max: 100 }),
  body('experience').optional().isIn(['1-2 years', '3-5 years', '5-10 years', '10+ years']),
  body('companyWebsite').optional().trim().isURL().withMessage('Company website must be valid URL'),
  body('companySize').optional().isIn(['1-10', '11-50', '51-200', '201-1000', '1000+']),
  body('bio').optional().trim().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    let profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const allowedFields = [
      'university', 'yearOfStudy', 'major', 'skills', 'careerInterests',
      'githubUsername', 'linkedinUrl', 'company', 'position', 'industry',
      'experience', 'companyWebsite', 'companySize', 'bio'
    ];

    // Update profile fields
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        profile[field] = req.body[field];
      }
    });

    // Check for achievements
    await checkAndAwardAchievements(req.user._id, profile);

    // Update last active date
    profile.lastActiveDate = new Date();
    
    await profile.save();

    // Create activity
    await new Activity({
      user: req.user._id,
      type: 'profile_updated',
      description: 'Profile updated successfully',
      pointsEarned: 25
    }).save();

    // Add points
    await profile.addPoints(25);

    // Update user profile completion status
    const user = await User.findById(req.user._id);
    user.profileCompleted = profile.checkCompletion();
    await user.save();

    await profile.populate('user', 'fullName email role createdAt');

    res.json({
      message: 'Profile updated successfully',
      profile
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/profiles/:userId
// @desc    Get user profile by ID (public)
// @access  Public
router.get('/:userId', optional, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId })
      .populate('user', 'fullName email role createdAt');

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Increment profile views if viewer is different user
    if (req.user && req.user._id.toString() !== req.params.userId) {
      profile.profileViews += 1;
      await profile.save();
    }

    res.json(profile);
  } catch (error) {
    console.error('Get profile by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/profiles
// @desc    Get all student profiles (for industry experts)
// @access  Private (industry experts only)
router.get('/', [auth, authorize('industry_expert', 'admin')], async (req, res) => {
  try {
    const { page = 1, limit = 10, skills, university, yearOfStudy, sortBy = 'points' } = req.query;

    // Build filter
    const filter = {};
    const userFilter = { role: 'student', isActive: true };

    if (skills) {
      filter.skills = { $in: skills.split(',') };
    }
    if (university) {
      filter.university = new RegExp(university, 'i');
    }
    if (yearOfStudy) {
      filter.yearOfStudy = parseInt(yearOfStudy);
    }

    // Get user IDs that match user filter
    const matchingUsers = await User.find(userFilter).select('_id');
    const userIds = matchingUsers.map(u => u._id);
    filter.user = { $in: userIds };

    // Build sort
    let sortOption = {};
    switch (sortBy) {
      case 'points':
        sortOption = { points: -1 };
        break;
      case 'level':
        sortOption = { level: -1, points: -1 };
        break;
      case 'recent':
        sortOption = { lastActiveDate: -1 };
        break;
      default:
        sortOption = { points: -1 };
    }

    const profiles = await Profile.find(filter)
      .populate('user', 'fullName email role createdAt')
      .sort(sortOption)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Profile.countDocuments(filter);

    res.json({
      profiles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get profiles error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/profiles/skills
// @desc    Add skill to profile
// @access  Private (students only)
router.post('/skills', [
  auth,
  authorize('student'),
  body('skill').trim().notEmpty().withMessage('Skill is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { skill } = req.body;
    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Check if skill already exists
    if (profile.skills.includes(skill)) {
      return res.status(400).json({ message: 'Skill already exists' });
    }

    profile.skills.push(skill);
    await profile.save();

    // Create activity
    await new Activity({
      user: req.user._id,
      type: 'skill_added',
      description: `Added new skill: ${skill}`,
      pointsEarned: 10,
      metadata: { skill }
    }).save();

    // Add points
    await profile.addPoints(10);

    // Check for skill-related achievements
    await checkAndAwardAchievements(req.user._id, profile);

    res.json({
      message: 'Skill added successfully',
      skills: profile.skills
    });
  } catch (error) {
    console.error('Add skill error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to check and award achievements
async function checkAndAwardAchievements(userId, profile) {
  try {
    // Check existing achievements to avoid duplicates
    const existingAchievements = await Achievement.find({ user: userId });
    const existingTitles = existingAchievements.map(a => a.title);

    for (const template of achievementTemplates) {
      if (existingTitles.includes(template.title)) continue;

      let shouldAward = false;

      // Check criteria
      if (template.title === 'Skill Collector') {
        shouldAward = profile.skills.length >= 10;
      }
      // Add more achievement criteria as needed

      if (shouldAward) {
        const achievement = new Achievement({
          user: userId,
          title: template.title,
          description: template.description,
          type: template.type,
          rarity: template.rarity,
          points: template.points,
          icon: template.icon,
          criteria: template.criteria
        });

        await achievement.save();

        // Add points for achievement
        await profile.addPoints(template.points);

        // Create activity
        await new Activity({
          user: userId,
          type: 'achievement_earned',
          description: `Earned achievement: ${template.title}`,
          pointsEarned: template.points,
          metadata: { achievementId: achievement._id }
        }).save();
      }
    }
  } catch (error) {
    console.error('Achievement check error:', error);
  }
}

module.exports = router;
