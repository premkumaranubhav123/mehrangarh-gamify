import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  achievementId: { 
    type: String, 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  icon: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    enum: ['exploration', 'completion', 'skill', 'collection', 'social'],
    required: true 
  },
  points: { 
    type: Number, 
    default: 0 
  },
  unlockedAt: { 
    type: Date, 
    default: Date.now 
  },
  progress: { 
    type: Number, 
    default: 0 
  },
  target: { 
    type: Number, 
    default: 1 
  },
  isUnlocked: { 
    type: Boolean, 
    default: false 
  }
});

// Compound index for user and achievement
achievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true });

// Static method to get user achievements
achievementSchema.statics.getUserAchievements = async function(userId) {
  return this.find({ userId }).sort({ unlockedAt: -1 });
};

// Static method to unlock achievement
achievementSchema.statics.unlockAchievement = async function(userId, achievementData) {
  const existing = await this.findOne({ userId, achievementId: achievementData.achievementId });
  
  if (existing) {
    return existing;
  }
  
  return this.create({
    userId,
    ...achievementData,
    isUnlocked: true,
    unlockedAt: new Date()
  });
};

// Static method to update achievement progress
achievementSchema.statics.updateProgress = async function(userId, achievementId, progress) {
  const achievement = await this.findOne({ userId, achievementId });
  
  if (!achievement) {
    return null;
  }
  
  achievement.progress = Math.min(progress, achievement.target);
  
  // Auto-unlock if progress reaches target
  if (!achievement.isUnlocked && achievement.progress >= achievement.target) {
    achievement.isUnlocked = true;
    achievement.unlockedAt = new Date();
  }
  
  await achievement.save();
  return achievement;
};

export default mongoose.model('Achievement', achievementSchema);