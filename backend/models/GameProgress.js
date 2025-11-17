import mongoose from 'mongoose';

const gameProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  storyId: { type: String, required: true },
  paintingId: { type: String, required: true },
  score: { type: Number, default: 0 },
  stars: { type: Number, default: 0 },
  timeSpent: { type: Number, default: 0 }, // in seconds
  completedAt: { type: Date, default: Date.now },
  answers: [{
    questionId: String,
    selectedOption: Number,
    isCorrect: Boolean,
    points: Number
  }]
});

// Use export default for ES6 modules
export default mongoose.model('GameProgress', gameProgressSchema);