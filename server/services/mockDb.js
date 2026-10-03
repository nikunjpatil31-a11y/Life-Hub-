// Mock Database Store with full CRUD capability for offline/fallback mode

const mockData = {
  users: [
    {
      _id: 'user_demo_123',
      name: 'Nikunj Sharma',
      email: 'demo@lifehub.com',
      passwordHash: '$2a$10$e8w...demo', // bcrypt hash placeholder
      role: 'User',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      createdAt: new Date().toISOString()
    }
  ],
  finances: [
    { _id: 'fin_1', userId: 'user_demo_123', title: 'Salary Credit', amount: 450000, type: 'income', category: 'Salary', date: '2026-09-25' },
    { _id: 'fin_2', userId: 'user_demo_123', title: 'Cloud Server & Domain Hosting', amount: 2499, type: 'expense', category: 'Tech & Subscriptions', date: '2026-09-26' },
    { _id: 'fin_3', userId: 'user_demo_123', title: 'Organic Groceries & Produce', amount: 4850, type: 'expense', category: 'Food & Dining', date: '2026-09-27' },
    { _id: 'fin_4', userId: 'user_demo_123', title: 'Freelance UI Design Project', amount: 65000, type: 'income', category: 'Freelance', date: '2026-09-28' },
    { _id: 'fin_5', userId: 'user_demo_123', title: 'Electricity & Fiber Wifi Bill', amount: 3200, type: 'expense', category: 'Utilities', date: '2026-09-28' }
  ],
  tasksNotes: [
    { _id: 'tn_1', userId: 'user_demo_123', itemType: 'task', title: 'Finalize Q4 Product Roadmap Presentation', status: 'in-progress', priority: 'high', category: 'Office', dueDate: '2026-09-30' },
    { _id: 'tn_2', userId: 'user_demo_123', itemType: 'task', title: 'Renew Passport & International Travel Insurance', status: 'todo', priority: 'urgent', category: 'Vault', dueDate: '2026-10-05' },
    { _id: 'tn_3', userId: 'user_demo_123', itemType: 'task', title: 'Complete React 19 Server Components Module', status: 'completed', priority: 'normal', category: 'Study', dueDate: '2026-09-27' },
    { _id: 'tn_4', userId: 'user_demo_123', itemType: 'note', title: 'LifeHub Architecture Ideas', content: 'Use hybrid Mongoose + fallback mock storage. Glassmorphism dark mode aesthetic. Cmd+K quick command palette.', pinned: true, category: 'Personal', tags: ['architecture', 'ideas'] },
    { _id: 'tn_5', userId: 'user_demo_123', itemType: 'note', title: 'Monthly Gym & Nutrition Plan', content: '3 days strength training, 2 days cardio, high protein macro targets.', pinned: false, category: 'Health', tags: ['fitness', 'routine'] }
  ],
  documents: [
    { _id: 'doc_1', userId: 'user_demo_123', name: 'Aadhaar & Passport Backup PDF', category: 'ID Proofs', fileType: 'PDF', issueDate: '2022-01-15', expiryDate: '2032-01-14', notes: 'Main identification docs', verified: true },
    { _id: 'doc_2', userId: 'user_demo_123', name: 'Comprehensive Health Insurance Policy', category: 'Medical', fileType: 'PDF', issueDate: '2025-11-01', expiryDate: '2026-10-31', notes: 'Family Floater Plan ($100k)', verified: true },
    { _id: 'doc_3', userId: 'user_demo_123', name: 'Vehicle Registration & Comprehensive Insurance', category: 'Automobile', fileType: 'DOCX', issueDate: '2024-05-10', expiryDate: '2026-10-10', notes: 'Policy No. #IN-992019', verified: true },
    { _id: 'doc_4', userId: 'user_demo_123', name: 'Home Property Deed & Tax Receipt', category: 'Property', fileType: 'PDF', issueDate: '2021-08-20', expiryDate: 'N/A', notes: 'Safe locker reference #3B', verified: true }
  ],
  study: {
    subjects: [
      { _id: 'sub_1', name: 'System Design & Distributed Architectures', targetHours: 40, completedHours: 28, status: 'Active' },
      { _id: 'sub_2', name: 'Advanced Machine Learning & Neural Nets', targetHours: 50, completedHours: 19, status: 'Active' },
      { _id: 'sub_3', name: 'TypeScript & React Native Masterclass', targetHours: 30, completedHours: 30, status: 'Completed' }
    ],
    assignments: [
      { _id: 'asg_1', title: 'Implement Rate Limiter Middleware', subject: 'System Design', dueDate: '2026-10-02', status: 'Pending' },
      { _id: 'asg_2', title: 'Train BERT Text Classifier on Dataset', subject: 'Machine Learning', dueDate: '2026-10-08', status: 'In Progress' }
    ],
    flashcards: [
      { _id: 'fc_1', question: 'What is CAP Theorem?', answer: 'In a distributed system, you can only pick 2 out of 3: Consistency, Availability, Partition Tolerance.', subject: 'System Design' },
      { _id: 'fc_2', question: 'Difference between Debounce & Throttle?', answer: 'Debounce waits for a pause in events; throttle ensures max execution once per time interval.', subject: 'Web Dev' }
    ]
  },
  office: {
    projects: [
      { _id: 'prj_1', title: 'Enterprise Dashboard Redesign', client: 'Acme Corp', deadline: '2026-10-15', progress: 75, status: 'Active' },
      { _id: 'prj_2', title: 'Mobile App API Integration', client: 'FinTech Startup', deadline: '2026-10-25', progress: 40, status: 'Active' }
    ],
    workLogs: [
      { _id: 'wl_1', date: '2026-09-28', hours: 7.5, taskDescription: 'Designed Mongoose schemas & setup fallback mock store for LifeHub server' },
      { _id: 'wl_2', date: '2026-09-27', hours: 8.0, taskDescription: 'Built Vite React frontend pages with glassmorphism dark theme' }
    ],
    meetings: [
      { _id: 'mt_1', title: 'Sprint Planning & Backlog Grooming', time: '10:00 AM', status: 'Scheduled', platform: 'Google Meet' },
      { _id: 'mt_2', title: 'Client Feedback Review', time: '03:30 PM', status: 'Completed', platform: 'Zoom' }
    ]
  },
  home: {
    inventory: [
      { _id: 'inv_1', item: 'Philips Hue Smart Bulbs (Pack of 4)', location: 'Living Room Closet', quantity: 2, condition: 'New' },
      { _id: 'inv_2', item: 'First Aid Medical Kit & Bandages', location: 'Bathroom Drawer 1', quantity: 1, condition: 'Good' }
    ],
    groceryList: [
      { _id: 'groc_1', item: 'Almond Milk (Unsweetened)', qty: '2 Liters', estimatedCost: 380, bought: false },
      { _id: 'groc_2', item: 'Avocados & Fresh Spinach', qty: '1 Bag', estimatedCost: 250, bought: true },
      { _id: 'groc_3', item: 'Whey Protein Isolate (Chocolate)', qty: '1 Tub', estimatedCost: 4200, bought: false },
      { _id: 'groc_4', item: 'Whole Grain Bread & Oats', qty: '2 Packs', estimatedCost: 180, bought: true }
    ],
    maintenance: [
      { _id: 'maint_1', task: 'HVAC AC Filter Cleaning & Service', dueDate: '2026-10-10', priority: 'High', status: 'Scheduled' },
      { _id: 'maint_2', task: 'Water Purifier RO Cartridge Replacement', dueDate: '2026-10-20', priority: 'Medium', status: 'Pending' }
    ]
  },
  smartBox: [
    { _id: 'sb_1', name: 'Spare House Keys & Gate Remote', room: 'Master Bedroom', boxName: 'Safe Box #1', drawerNumber: 'Drawer 2', tags: ['keys', 'security', 'emergency'], notes: 'Includes tag #4' },
    { _id: 'sb_2', name: 'DSLR Camera Lenses & Tripod Mounts', room: 'Study Room', boxName: 'Tech Container A', drawerNumber: 'Shelf Top', tags: ['electronics', 'camera', 'gear'], notes: 'Padded black case' },
    { _id: 'sb_3', name: 'International Travel Adapters & Powerbanks', room: 'Office / Den', boxName: 'Cable Drawer', drawerNumber: 'Drawer 3', tags: ['travel', 'cables', 'chargers'], notes: '2x 65W GaN Chargers' },
    { _id: 'sb_4', name: 'Car Registration Docs & Spare Keycard', room: 'Entrance Hall', boxName: 'Key Hanger Cabinet', drawerNumber: 'Top Locker', tags: ['car', 'documents'], notes: 'Keycard PIN on doc vault' }
  ],
  goals: [
    { _id: 'goal_1', title: 'Emergency Fund (6 Months Expenses)', category: 'Savings', targetAmount: 600000, currentAmount: 480000, targetDate: '2026-12-31', completed: false },
    { _id: 'goal_2', title: 'AWS Solutions Architect Professional Cert', category: 'Career', targetAmount: 100, currentAmount: 85, targetDate: '2026-10-30', completed: false },
    { _id: 'goal_3', title: 'Buy Ergonomic Herman Miller Chair', category: 'Wishlist', targetAmount: 120000, currentAmount: 120000, targetDate: '2026-09-20', completed: true }
  ]
};

// Helper methods for mock storage CRUD
const mockDb = {
  get: (collection) => mockData[collection] || [],
  getById: (collection, id) => {
    const list = mockData[collection];
    if (Array.isArray(list)) return list.find(item => item._id === id);
    return null;
  },
  insert: (collection, item) => {
    const newItem = { _id: `${collection}_${Date.now()}`, ...item, createdAt: new Date().toISOString() };
    if (Array.isArray(mockData[collection])) {
      mockData[collection].unshift(newItem);
    }
    return newItem;
  },
  update: (collection, id, updates) => {
    const list = mockData[collection];
    if (Array.isArray(list)) {
      const idx = list.findIndex(i => i._id === id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...updates, updatedAt: new Date().toISOString() };
        return list[idx];
      }
    }
    return null;
  },
  delete: (collection, id) => {
    const list = mockData[collection];
    if (Array.isArray(list)) {
      mockData[collection] = list.filter(i => i._id !== id);
      return true;
    }
    return false;
  },
  // Sub-keys helper for nested study, office, home
  getNested: (parent, subkey) => (mockData[parent] && mockData[parent][subkey]) ? mockData[parent][subkey] : [],
  insertNested: (parent, subkey, item) => {
    if (!mockData[parent]) mockData[parent] = {};
    if (!mockData[parent][subkey]) mockData[parent][subkey] = [];
    const newItem = { _id: `${subkey}_${Date.now()}`, ...item };
    mockData[parent][subkey].unshift(newItem);
    return newItem;
  },
  updateNested: (parent, subkey, id, updates) => {
    if (mockData[parent] && Array.isArray(mockData[parent][subkey])) {
      const idx = mockData[parent][subkey].findIndex(i => i._id === id);
      if (idx !== -1) {
        mockData[parent][subkey][idx] = { ...mockData[parent][subkey][idx], ...updates };
        return mockData[parent][subkey][idx];
      }
    }
    return null;
  },
  deleteNested: (parent, subkey, id) => {
    if (mockData[parent] && Array.isArray(mockData[parent][subkey])) {
      mockData[parent][subkey] = mockData[parent][subkey].filter(i => i._id !== id);
      return true;
    }
    return false;
  }
};

module.exports = { mockData, mockDb };
