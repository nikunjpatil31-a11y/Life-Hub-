const mongoose = require('mongoose');

const TaskNoteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  itemType: { type: String, enum: ['task', 'note'], required: true },
  title: { type: String, required: true },
  content: { type: String, default: '' },
  status: { type: String, enum: ['todo', 'in-progress', 'completed'], default: 'todo' },
  priority: { type: String, enum: ['urgent', 'high', 'normal'], default: 'normal' },
  category: { type: String, default: 'General' },
  dueDate: { type: String },
  pinned: { type: Boolean, default: false },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TaskNote', TaskNoteSchema);
