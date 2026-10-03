const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  fileType: { type: String, default: 'PDF' },
  issueDate: { type: String },
  expiryDate: { type: String },
  notes: { type: String },
  verified: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Document', DocumentSchema);
