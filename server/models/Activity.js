const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'profile_setup',
      'profile_updated', 
      'skill_added',
      'course_started',
      'course_completed',
      'quiz_completed',
      'project_submitted',
      'achievement_earned',
      'login'
    ],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  pointsEarned: {
    type: Number,
    default: 0,
    min: 0
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed // Flexible metadata object
  }
}, {
  timestamps: true
});

// Indexes
activitySchema.index({ user: 1, createdAt: -1 });
activitySchema.index({ type: 1 });
activitySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);
