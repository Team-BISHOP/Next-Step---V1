const express = require('express');
const Profile = require('../models/Profile');
const { Achievement } = require('../models/Achievement');
const User = require('../models/User');

const router = express.Router();

// @route   GET /api/leaderboard
// @desc    Get leaderboard data
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category = 'overall', limit = 50 } = req.query;

    let sortOption = {};
    let pipeline = [];

    // Build aggregation pipeline based on category
    switch (category) {
      case 'points':
        sortOption = { points: -1, level: -1 };
        break;
      case 'level':
        sortOption = { level: -1, points: -1 };
        break;
      case 'achievements':
        pipeline = [
          {
            $lookup: {
              from: 'achievements',
              localField: 'user',
              foreignField: 'user',
              as: 'achievements'
            }
          },
          {
            $addFields: {
              achievementCount: { $size: '$achievements' }
            }
          },
          {
            $sort: { achievementCount: -1, points: -1 }
          }
        ];
        break;
      case 'learning':
        // Based on recent activity and points growth
        sortOption = { lastActiveDate: -1, points: -1 };
        break;
      case 'growth':
        // Mock growth calculation based on level and recent activity
        sortOption = { level: -1, lastActiveDate: -1 };
        break;
      default: // overall
        sortOption = { points: -1, level: -1 };
    }

    let leaderboard;

    if (pipeline.length > 0) {
      // Use aggregation pipeline
      pipeline.unshift({
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userInfo'
        }
      });
      
      pipeline.push(
        {
          $match: {
            'userInfo.role': 'student',
            'userInfo.isActive': true
          }
        },
        {
          $limit: parseInt(limit)
        }
      );

      const results = await Profile.aggregate(pipeline);
      
      leaderboard = results.map((profile, index) => ({
        rank: index + 1,
        user: {
          id: profile.user,
          fullName: profile.userInfo[0]?.fullName || 'Unknown',
          avatar: profile.avatar
        },
        points: profile.points || 0,
        level: profile.level || 1,
        university: profile.university,
        major: profile.major,
        skills: profile.skills || [],
        achievementCount: profile.achievementCount || 0,
        lastActive: profile.lastActiveDate
      }));
    } else {
      // Use simple find and sort
      const profiles = await Profile.find()
        .populate({
          path: 'user',
          match: { role: 'student', isActive: true },
          select: 'fullName role'
        })
        .sort(sortOption)
        .limit(parseInt(limit));

      // Filter out profiles where user population failed (non-students)
      const validProfiles = profiles.filter(profile => profile.user);

      // Get achievement counts for each user
      const userIds = validProfiles.map(p => p.user._id);
      const achievementCounts = await Achievement.aggregate([
        { $match: { user: { $in: userIds } } },
        { $group: { _id: '$user', count: { $sum: 1 } } }
      ]);

      const achievementMap = achievementCounts.reduce((acc, item) => {
        acc[item._id.toString()] = item.count;
        return acc;
      }, {});

      leaderboard = validProfiles.map((profile, index) => ({
        rank: index + 1,
        user: {
          id: profile.user._id,
          fullName: profile.user.fullName,
          avatar: profile.avatar
        },
        points: profile.points || 0,
        level: profile.level || 1,
        university: profile.university,
        major: profile.major,
        skills: profile.skills || [],
        achievementCount: achievementMap[profile.user._id.toString()] || 0,
        lastActive: profile.lastActiveDate
      }));
    }

    // Calculate some overall stats
    const totalStudents = await User.countDocuments({ role: 'student', isActive: true });
    const totalPoints = await Profile.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      {
        $match: {
          'userInfo.role': 'student',
          'userInfo.isActive': true
        }
      },
      {
        $group: {
          _id: null,
          totalPoints: { $sum: '$points' }
        }
      }
    ]);

    const stats = {
      totalStudents,
      totalPoints: totalPoints[0]?.totalPoints || 0,
      averagePoints: totalStudents > 0 ? Math.round((totalPoints[0]?.totalPoints || 0) / totalStudents) : 0,
      category,
      lastUpdated: new Date()
    };

    res.json({
      leaderboard,
      stats
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/leaderboard/user/:userId/rank
// @desc    Get specific user's rank
// @access  Public
router.get('/user/:userId/rank', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { category = 'overall' } = req.query;

    const userProfile = await Profile.findOne({ user: userId })
      .populate('user', 'fullName role');

    if (!userProfile || userProfile.user.role !== 'student') {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    let rank;
    
    switch (category) {
      case 'points':
        rank = await Profile.countDocuments({
          points: { $gt: userProfile.points }
        }) + 1;
        break;
      case 'level':
        rank = await Profile.countDocuments({
          $or: [
            { level: { $gt: userProfile.level } },
            { level: userProfile.level, points: { $gt: userProfile.points } }
          ]
        }) + 1;
        break;
      default:
        rank = await Profile.countDocuments({
          $or: [
            { points: { $gt: userProfile.points } },
            { points: userProfile.points, level: { $gt: userProfile.level } }
          ]
        }) + 1;
    }

    res.json({
      rank,
      category,
      user: {
        id: userProfile.user._id,
        fullName: userProfile.user.fullName,
        points: userProfile.points,
        level: userProfile.level
      }
    });
  } catch (error) {
    console.error('Get user rank error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
