const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  targetDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Goal', GoalSchema);
