const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getIsMongoConnected } = require('../config/db');
const { mockDb, mockData } = require('../services/mockDb');
const { JWT_SECRET } = require('../middleware/auth');

// Seed MongoDB if empty helper
const autoSeedMongoIfEmpty = async (Model, initialList, userId = 'user_demo_123') => {
  try {
    const count = await Model.countDocuments();
    if (count === 0 && initialList && initialList.length > 0) {
      await Model.insertMany(initialList.map(({ _id, ...rest }) => ({ ...rest, userId })));
    }
  } catch (err) {}
};



// Models (Mongoose)
const User = require('../models/User');
const Finance = require('../models/Finance');
const TaskNote = require('../models/TaskNote');
const Document = require('../models/Document');
const SmartBox = require('../models/SmartBox');
const Goal = require('../models/Goal');

// System status endpoint
router.get('/status', (req, res) => {
  const isMongo = getIsMongoConnected();
  res.json({
    status: 'online',
    storageMode: isMongo ? 'MongoDB' : 'Mock Fallback Storage',
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// 1. AUTHENTICATION (JWT + bcrypt)
// ==========================================
router.post('/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }

  const isMongo = getIsMongoConnected();

  try {
    if (isMongo) {
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ message: 'User already exists' });

      const passwordHash = await bcrypt.hash(password, 10);
      user = new User({ name, email, passwordHash });
      await user.save();

      const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar } });
    } else {
      // Mock mode
      const existing = mockDb.get('users').find(u => u.email === email);
      if (existing) return res.status(400).json({ message: 'User already exists' });

      const newUser = mockDb.insert('users', { name, email, passwordHash: 'hashed_' + password, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' });
      const token = jwt.sign({ id: newUser._id, email: newUser.email, name: newUser.name }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user: { id: newUser._id, name: newUser.name, email: newUser.email, avatar: newUser.avatar } });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const isMongo = getIsMongoConnected();

  try {
    if (isMongo) {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar } });
    } else {
      // Mock mode: Allow demo user or any login
      let user = mockDb.get('users').find(u => u.email === email);
      if (!user) {
        user = mockDb.insert('users', { name: email.split('@')[0], email, passwordHash: 'mock', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' });
      }
      const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar } });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/auth/me', (req, res) => {
  res.json({ user: req.user, storageMode: getIsMongoConnected() ? 'MongoDB' : 'Mock Fallback Storage' });
});

// ==========================================
// 2. FINANCE MANAGEMENT API
// ==========================================
router.get('/finance', async (req, res) => {
  if (getIsMongoConnected()) {
    await autoSeedMongoIfEmpty(Finance, mockData.finances, req.user.id);
    const data = await Finance.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.json(data);
  }
  res.json(mockDb.get('finances'));
});

router.post('/finance', async (req, res) => {
  const { title, amount, type, category, date } = req.body;
  if (getIsMongoConnected()) {
    const item = new Finance({ userId: req.user.id, title, amount: Number(amount), type, category, date: date || new Date().toISOString().split('T')[0] });
    await item.save();
    return res.json(item);
  }
  const item = mockDb.insert('finances', { userId: req.user.id, title, amount: Number(amount), type, category, date: date || new Date().toISOString().split('T')[0] });
  res.json(item);
});

router.delete('/finance/:id', async (req, res) => {
  if (getIsMongoConnected()) {
    await Finance.findByIdAndDelete(req.params.id);
    return res.json({ success: true });
  }
  mockDb.delete('finances', req.params.id);
  res.json({ success: true });
});

// ==========================================
// 3. TASKS & NOTES API
// ==========================================
router.get('/tasks-notes', async (req, res) => {
  if (getIsMongoConnected()) {
    await autoSeedMongoIfEmpty(TaskNote, mockData.tasksNotes, req.user.id);
    const data = await TaskNote.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.json(data);
  }
  res.json(mockDb.get('tasksNotes'));
});

router.post('/tasks-notes', async (req, res) => {
  const { itemType, title, content, status, priority, category, dueDate, pinned, tags } = req.body;
  if (getIsMongoConnected()) {
    const item = new TaskNote({ userId: req.user.id, itemType, title, content, status, priority, category, dueDate, pinned, tags });
    await item.save();
    return res.json(item);
  }
  const item = mockDb.insert('tasksNotes', { userId: req.user.id, itemType, title, content, status: status || 'todo', priority: priority || 'normal', category: category || 'General', dueDate, pinned: !!pinned, tags: tags || [] });
  res.json(item);
});

router.put('/tasks-notes/:id', async (req, res) => {
  if (getIsMongoConnected()) {
    const updated = await TaskNote.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json(updated);
  }
  const updated = mockDb.update('tasksNotes', req.params.id, req.body);
  res.json(updated);
});

router.delete('/tasks-notes/:id', async (req, res) => {
  if (getIsMongoConnected()) {
    await TaskNote.findByIdAndDelete(req.params.id);
    return res.json({ success: true });
  }
  mockDb.delete('tasksNotes', req.params.id);
  res.json({ success: true });
});

// ==========================================
// 4. DOCUMENT VAULT API
// ==========================================
router.get('/documents', async (req, res) => {
  if (getIsMongoConnected()) {
    await autoSeedMongoIfEmpty(Document, mockData.documents, req.user.id);
    const docs = await Document.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.json(docs);
  }
  res.json(mockDb.get('documents'));
});

router.post('/documents', async (req, res) => {
  const { name, category, fileType, issueDate, expiryDate, notes } = req.body;
  if (getIsMongoConnected()) {
    const doc = new Document({ userId: req.user.id, name, category, fileType, issueDate, expiryDate, notes });
    await doc.save();
    return res.json(doc);
  }
  const doc = mockDb.insert('documents', { userId: req.user.id, name, category, fileType: fileType || 'PDF', issueDate, expiryDate, notes, verified: true });
  res.json(doc);
});

router.delete('/documents/:id', async (req, res) => {
  if (getIsMongoConnected()) {
    await Document.findByIdAndDelete(req.params.id);
    return res.json({ success: true });
  }
  mockDb.delete('documents', req.params.id);
  res.json({ success: true });
});

// ==========================================
// 5. STUDY WORKSPACE API
// ==========================================
router.get('/study', (req, res) => {
  res.json(mockData.study);
});

router.post('/study/:type', (req, res) => {
  const { type } = req.params; // subjects, assignments, flashcards
  const item = mockDb.insertNested('study', type, req.body);
  res.json(item);
});

router.put('/study/:type/:id', (req, res) => {
  const { type, id } = req.params;
  const updated = mockDb.updateNested('study', type, id, req.body);
  res.json(updated);
});

router.delete('/study/:type/:id', (req, res) => {
  const { type, id } = req.params;
  mockDb.deleteNested('study', type, id);
  res.json({ success: true });
});

// ==========================================
// 6. OFFICE WORKSPACE API
// ==========================================
router.get('/office', (req, res) => {
  res.json(mockData.office);
});

router.post('/office/:type', (req, res) => {
  const { type } = req.params; // projects, workLogs, meetings
  const item = mockDb.insertNested('office', type, req.body);
  res.json(item);
});

router.put('/office/:type/:id', (req, res) => {
  const { type, id } = req.params;
  const updated = mockDb.updateNested('office', type, id, req.body);
  res.json(updated);
});

router.delete('/office/:type/:id', (req, res) => {
  const { type, id } = req.params;
  mockDb.deleteNested('office', type, id);
  res.json({ success: true });
});

// ==========================================
// 7. HOME MANAGEMENT API
// ==========================================
router.get('/home', (req, res) => {
  res.json(mockData.home);
});

router.post('/home/:type', (req, res) => {
  const { type } = req.params; // inventory, groceryList, maintenance
  const item = mockDb.insertNested('home', type, req.body);
  res.json(item);
});

router.put('/home/:type/:id', (req, res) => {
  const { type, id } = req.params;
  const updated = mockDb.updateNested('home', type, id, req.body);
  res.json(updated);
});

router.delete('/home/:type/:id', (req, res) => {
  const { type, id } = req.params;
  mockDb.deleteNested('home', type, id);
  res.json({ success: true });
});

// ==========================================
// 8. SMART BOX (ITEM LOCATOR) API
// ==========================================
router.get('/smartbox', async (req, res) => {
  if (getIsMongoConnected()) {
    await autoSeedMongoIfEmpty(SmartBox, mockData.smartBox, req.user.id);
    const items = await SmartBox.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.json(items);
  }
  res.json(mockDb.get('smartBox'));
});

router.post('/smartbox', async (req, res) => {
  const { name, room, boxName, drawerNumber, tags, notes } = req.body;
  if (getIsMongoConnected()) {
    const item = new SmartBox({ userId: req.user.id, name, room, boxName, drawerNumber, tags: Array.isArray(tags) ? tags : tags ? tags.split(',') : [], notes });
    await item.save();
    return res.json(item);
  }
  const item = mockDb.insert('smartBox', { userId: req.user.id, name, room, boxName, drawerNumber: drawerNumber || 'Drawer 1', tags: Array.isArray(tags) ? tags : tags ? tags.split(',') : [], notes });
  res.json(item);
});

router.delete('/smartbox/:id', async (req, res) => {
  if (getIsMongoConnected()) {
    await SmartBox.findByIdAndDelete(req.params.id);
    return res.json({ success: true });
  }
  mockDb.delete('smartBox', req.params.id);
  res.json({ success: true });
});

// ==========================================
// 9. GOALS & WISHLIST API
// ==========================================
router.get('/goals', async (req, res) => {
  if (getIsMongoConnected()) {
    await autoSeedMongoIfEmpty(Goal, mockData.goals, req.user.id);
    const goals = await Goal.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.json(goals);
  }
  res.json(mockDb.get('goals'));
});

router.post('/goals', async (req, res) => {
  try {
    const { title, category, targetAmount, currentAmount, targetDate } = req.body;
    const finalDate = targetDate && targetDate.trim() ? targetDate : new Date().toISOString().split('T')[0];
    if (getIsMongoConnected()) {
      const goal = new Goal({ userId: req.user.id, title, category, targetAmount: Number(targetAmount), currentAmount: Number(currentAmount || 0), targetDate: finalDate });
      await goal.save();
      return res.json(goal);
    }
    const goal = mockDb.insert('goals', { userId: req.user.id, title, category, targetAmount: Number(targetAmount), currentAmount: Number(currentAmount || 0), targetDate: finalDate, completed: Number(currentAmount) >= Number(targetAmount) });
    res.json(goal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/goals/:id', async (req, res) => {
  if (getIsMongoConnected()) {
    const updated = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json(updated);
  }
  const updated = mockDb.update('goals', req.params.id, req.body);
  res.json(updated);
});

router.delete('/goals/:id', async (req, res) => {
  if (getIsMongoConnected()) {
    await Goal.findByIdAndDelete(req.params.id);
    return res.json({ success: true });
  }
  mockDb.delete('goals', req.params.id);
  res.json({ success: true });
});

// ==========================================
// 10. ANALYTICS & INSIGHTS API
// ==========================================
router.get('/analytics', async (req, res) => {
  const finances = mockDb.get('finances');
  const tasks = mockDb.get('tasksNotes');
  const goals = mockDb.get('goals');
  const smartbox = mockDb.get('smartBox');

  const totalIncome = finances.filter(f => f.type === 'income').reduce((sum, f) => sum + f.amount, 0);
  const totalExpense = finances.filter(f => f.type === 'expense').reduce((sum, f) => sum + f.amount, 0);
  const completedTasks = tasks.filter(t => t.itemType === 'task' && t.status === 'completed').length;
  const totalTasks = tasks.filter(t => t.itemType === 'task').length;

  res.json({
    productivityScore: 92,
    taskCompletionRate: totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 75,
    financeOverview: {
      totalIncome,
      totalExpense,
      netSavings: totalIncome - totalExpense
    },
    goalsCount: goals.length,
    smartBoxItemsCount: smartbox.length,
    storageMode: getIsMongoConnected() ? 'MongoDB' : 'Mock Fallback Storage'
  });
});

module.exports = router;
