const mongoose = require('mongoose');

const SmartBoxSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  room: { type: String, required: true },
  boxName: { type: String, required: true },
  drawerNumber: { type: String, default: 'Default' },
  tags: [{ type: String }],
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SmartBox', SmartBoxSchema);
