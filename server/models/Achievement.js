const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['learning', 'project', 'social', 'milestone', 'skill'],
    required: true
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  points: {
    type: Number,
    required: true,
    min: 0
  },
  icon: {
    type: String,
    default: 'trophy'
  },
  earnedAt: {
    type: Date,
    default: Date.now
  },
  criteria: {
    type: mongoose.Schema.Types.Mixed, // Flexible criteria object
    required: true
  }
}, {
  timestamps: true
});

// Indexes
achievementSchema.index({ user: 1, earnedAt: -1 });
achievementSchema.index({ type: 1 });
achievementSchema.index({ rarity: 1 });

const Achievement = mongoose.model('Achievement', achievementSchema);

// Pre-defined achievement templates
const achievementTemplates = [
  {
    title: 'Fast Learner',
    description: 'Completed a course in record time',
    type: 'learning',
    rarity: 'uncommon',
    points: 150,
    icon: 'zap',
    criteria: { courseCompletionTime: { $lt: 7 } } // Less than 7 days
  },
  {
    title: 'Perfect Week',
    description: 'Met all learning goals for a week',
    type: 'milestone',
    rarity: 'rare',
    points: 200,
    icon: 'check-circle',
    criteria: { weeklyGoalsCompleted: 7 }
  },
  {
    title: 'Streak Master',
    description: 'Maintained 7-day learning streak',
    type: 'milestone',
    rarity: 'rare',
    points: 250,
    icon: 'flame',
    criteria: { learningStreak: { $gte: 7 } }
  },
  {
    title: 'Project Pioneer',
    description: 'Submit your first project',
    type: 'project',
    rarity: 'common',
    points: 100,
    icon: 'award',
    criteria: { projectsSubmitted: { $gte: 1 } }
  },
  {
    title: 'Skill Collector',
    description: 'Add 10 different skills to your profile',
    type: 'skill',
    rarity: 'uncommon',
    points: 150,
    icon: 'target',
    criteria: { skillsCount: { $gte: 10 } }
  }
];

module.exports = { Achievement, achievementTemplates };
