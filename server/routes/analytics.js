const express = require('express');
const Activity = require('../models/Activity');
const Profile = require('../models/Profile');
const { Achievement } = require('../models/Achievement');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/analytics/me
// @desc    Get current user's analytics
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user profile
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Get activities from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activities = await Activity.find({
      user: userId,
      createdAt: { $gte: thirtyDaysAgo }
    }).sort({ createdAt: -1 });

    // Get achievements
    const achievements = await Achievement.find({ user: userId });

    // Calculate weekly activity data
    const weeklyData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      
      const dayActivities = activities.filter(activity => {
        const activityDate = new Date(activity.createdAt);
        return activityDate.toDateString() === date.toDateString();
      });

      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        points: dayActivities.reduce((sum, activity) => sum + (activity.pointsEarned || 0), 0),
        activities: dayActivities.length
      };
    });

    // Calculate activity type distribution
    const activityTypes = activities.reduce((acc, activity) => {
      const typeNames = {
        'profile_setup': 'Profile Setup',
        'profile_updated': 'Profile Updated',
        'skill_added': 'Skill Added',
        'course_started': 'Course Started',
        'course_completed': 'Course Completed',
        'quiz_completed': 'Quiz Completed',
        'project_submitted': 'Project Submitted',
        'achievement_earned': 'Achievement Earned',
        'login': 'Login'
      };

      const displayName = typeNames[activity.type] || activity.type;
      const existing = acc.find(item => item.name === displayName);
      
      if (existing) {
        existing.value += 1;
        existing.points += activity.pointsEarned || 0;
      } else {
        acc.push({
          name: displayName,
          value: 1,
          points: activity.pointsEarned || 0
        });
      }
      
      return acc;
    }, []);

    // Calculate skills proficiency (mock data based on skills)
    const skillsData = profile.skills.map((skill, index) => {
      const baseScore = 40 + (profile.level || 1) * 8;
      const variation = Math.floor(Math.random() * 30) - 15;
      const proficiency = Math.min(100, Math.max(20, baseScore + variation));
      
      return {
        name: skill,
        proficiency,
        projects: Math.floor(Math.random() * 8) + 2,
        experience: Math.floor(proficiency / 20) + 1
      };
    });

    // Calculate career interest mapping
    const careerInterestData = profile.careerInterests.map((interest, index) => {
      const relatedSkills = profile.skills.filter(skill => 
        skill.toLowerCase().includes(interest.toLowerCase().split(' ')[0]) ||
        interest.toLowerCase().includes(skill.toLowerCase())
      ).length;
      
      const baseScore = 60 + relatedSkills * 10;
      const userBonus = (profile.points || 0) / 20;
      const randomVariation = Math.floor(Math.random() * 20) - 10;
      
      return {
        subject: interest,
        value: Math.min(100, Math.max(30, baseScore + userBonus + randomVariation)),
        fullMark: 100
      };
    });

    // Overview stats
    const overviewStats = {
      totalPoints: profile.points || 0,
      currentLevel: profile.level || 1,
      skillsCount: profile.skills.length,
      activitiesCount: activities.length,
      achievementsCount: achievements.length,
      profileViews: profile.profileViews || 0
    };

    res.json({
      overview: overviewStats,
      weeklyData,
      activityTypes,
      skillsData,
      careerInterestData,
      recentActivities: activities.slice(0, 10),
      achievements: achievements.slice(0, 5)
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/analytics/user/:userId
// @desc    Get user analytics by ID (for public profiles)
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Get user profile
    const profile = await Profile.findOne({ user: userId })
      .populate('user', 'fullName role createdAt');
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Get public activities (limited data)
    const activities = await Activity.find({
      user: userId,
      type: { $in: ['course_completed', 'achievement_earned', 'project_submitted'] }
    }).sort({ createdAt: -1 }).limit(10);

    // Get achievements
    const achievements = await Achievement.find({ user: userId });

    // Calculate basic stats
    const stats = {
      totalPoints: profile.points || 0,
      currentLevel: profile.level || 1,
      skillsCount: profile.skills.length,
      achievementsCount: achievements.length
    };

    res.json({
      stats,
      recentActivities: activities,
      achievements: achievements.slice(0, 5),
      skills: profile.skills,
      careerInterests: profile.careerInterests
    });
  } catch (error) {
    console.error('Get user analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
