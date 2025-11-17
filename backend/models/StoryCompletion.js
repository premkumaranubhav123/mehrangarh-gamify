import mongoose from 'mongoose';

const storyCompletionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  storyId: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  stars: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  ageGroup: {
    type: String,
    enum: ['kids', 'adults', 'seniors'],
    required: true
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  answers: [{
    questionId: String,
    selectedOption: Number,
    isCorrect: Boolean,
    points: Number
  }]
});

// Compound index for faster queries
storyCompletionSchema.index({ user: 1, storyId: 1 });
storyCompletionSchema.index({ ageGroup: 1, completedAt: -1 });
storyCompletionSchema.index({ storyId: 1, score: -1 });

// Static method to get story statistics
storyCompletionSchema.statics.getStoryStats = async function(storyId) {
  const stats = await this.aggregate([
    { $match: { storyId } },
    {
      $group: {
        _id: '$storyId',
        totalCompletions: { $sum: 1 },
        averageScore: { $avg: '$score' },
        averageStars: { $avg: '$stars' },
        averageTime: { $avg: '$timeSpent' },
        bestScore: { $max: '$score' }
      }
    }
  ]);
  
  return stats[0] || {
    totalCompletions: 0,
    averageScore: 0,
    averageStars: 0,
    averageTime: 0,
    bestScore: 0
  };
};

// Static method to get user completions
storyCompletionSchema.statics.getUserCompletions = async function(userId) {
  return this.find({ user: userId })
    .sort({ completedAt: -1 })
    .populate('user', 'username ageGroup');
};

export default mongoose.model('StoryCompletion', storyCompletionSchema);