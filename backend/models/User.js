import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  ageGroup: {
    type: String,
    required: true,
    enum: ['kids', 'adults', 'seniors']
  },
  preferences: {
    fontSize: {
      type: String,
      enum: ['small', 'medium', 'large'],
      default: 'medium'
    },
    audioEnabled: {
      type: Boolean,
      default: true
    },
    highContrast: {
      type: Boolean,
      default: false
    },
    language: {
      type: String,
      default: 'english'
    }
  },
  gameProgress: {
    totalScore: {
      type: Number,
      default: 0
    },
    level: {
      type: Number,
      default: 1
    },
    completedStories: [{
      storyId: String,
      completedAt: Date,
      score: Number,
      stars: Number
    }],
    collectedTreasures: [{
      treasureId: String,
      collectedAt: Date,
      storyId: String
    }],
    achievements: [{
      achievementId: String,
      unlockedAt: Date,
      points: Number
    }]
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ ageGroup: 1, 'gameProgress.totalScore': -1 });
userSchema.index({ lastActive: -1 });

// Virtual for completion percentage
userSchema.virtual('completionPercentage').get(function() {
  const totalStories = 10; // Assuming 10 total stories
  return Math.round((this.gameProgress.completedStories.length / totalStories) * 100);
});

// Instance method to update progress
userSchema.methods.updateProgress = function(storyId, score, stars) {
  this.gameProgress.totalScore += score;
  
  const existingStory = this.gameProgress.completedStories.find(s => s.storyId === storyId);
  if (existingStory) {
    if (score > existingStory.score) {
      existingStory.score = score;
      existingStory.stars = stars;
      existingStory.completedAt = new Date();
    }
  } else {
    this.gameProgress.completedStories.push({
      storyId,
      score,
      stars,
      completedAt: new Date()
    });
  }
  
  this.lastActive = new Date();
  return this.save();
};

// Static method to get leaderboard
userSchema.statics.getLeaderboard = function(ageGroup = null, limit = 10) {
  const matchStage = ageGroup ? { ageGroup } : {};
  
  return this.aggregate([
    { $match: matchStage },
    { $sort: { 'gameProgress.totalScore': -1 } },
    { $limit: limit },
    {
      $project: {
        username: 1,
        ageGroup: 1,
        'gameProgress.totalScore': 1,
        'gameProgress.level': 1,
        'gameProgress.completedStories': 1,
        lastActive: 1
      }
    }
  ]);
};

export default mongoose.model('User', userSchema);