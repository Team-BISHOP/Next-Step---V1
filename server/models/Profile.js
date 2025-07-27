const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  // Common fields
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  
  // Student specific fields
  university: {
    type: String,
    trim: true
  },
  yearOfStudy: {
    type: Number,
    min: 1,
    max: 7
  },
  major: {
    type: String,
    trim: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  careerInterests: [{
    type: String,
    trim: true
  }],
  githubUsername: {
    type: String,
    trim: true
  },
  linkedinUrl: {
    type: String,
    trim: true
  },
  points: {
    type: Number,
    default: 0,
    min: 0
  },
  level: {
    type: Number,
    default: 1,
    min: 1
  },
  
  // Industry expert specific fields
  company: {
    type: String,
    trim: true
  },
  position: {
    type: String,
    trim: true
  },
  industry: {
    type: String,
    trim: true
  },
  experience: {
    type: String,
    enum: ['1-2 years', '3-5 years', '5-10 years', '10+ years']
  },
  companyWebsite: {
    type: String,
    trim: true
  },
  companySize: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-1000', '1000+']
  },
  
  // Analytics fields
  profileViews: {
    type: Number,
    default: 0
  },
  lastActiveDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
profileSchema.index({ user: 1 });
profileSchema.index({ points: -1 }); // For leaderboard
profileSchema.index({ level: -1 });
profileSchema.index({ skills: 1 });
profileSchema.index({ careerInterests: 1 });
profileSchema.index({ company: 1 });
profileSchema.index({ industry: 1 });

// Virtual for calculating next level points
profileSchema.virtual('nextLevelPoints').get(function() {
  return this.level * 1000; // Each level requires 1000 more points
});

// Method to add points
profileSchema.methods.addPoints = function(points) {
  this.points += points;
  this.level = Math.floor(this.points / 1000) + 1;
  this.lastActiveDate = new Date();
  return this.save();
};

// Method to update profile completion status
profileSchema.methods.checkCompletion = function() {
  const user = this.user;
  if (user.role === 'student') {
    return !!(this.university && this.major && this.skills.length > 0);
  } else if (user.role === 'industry_expert') {
    return !!(this.company && this.position && this.industry);
  }
  return false;
};

module.exports = mongoose.model('Profile', profileSchema);
