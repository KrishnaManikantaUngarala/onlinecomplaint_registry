const express = require('express');
const cors = require('cors');
const session = require('express-session');
const config = require('./config');
const { User, Complaint, AssignedComplaint, ChatWindow } = require('./Schema');
const mongoose = require('mongoose');

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// Block all API requests if MongoDB is not connected (prevents "buffering timed out")
app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      status: 'error',
      message: 'Database not connected. Open MongoDB Compass, connect to mongodb://127.0.0.1:27017, then restart the backend (stop and run: cd BACKEND, npm start).'
    });
  }
  next();
});

function requireAuth(req, res, next) {
  if (!req.session.user) return res.status(401).json({ status: 'error', message: 'Not authenticated' });
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session.user || req.session.user.userType !== 'admin') return res.status(403).json({ status: 'error', message: 'Admin only' });
  next();
}

function requireAgent(req, res, next) {
  if (!req.session.user || req.session.user.userType !== 'agent') return res.status(403).json({ status: 'error', message: 'Agent only' });
  next();
}

// Auth
app.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, userType } = req.body;
    if (!name || !email || !password || !phone || !userType) return res.status(400).json({ status: 'error', message: 'Missing fields' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ status: 'error', message: 'Email already registered' });
    const user = await User.create({ name, email, password, phone, userType });
    const u = user.toObject();
    delete u.password;
    req.session.user = u; // Log user in after register so complaint submit works
    res.json({ status: 'ok', user: u });
  } catch (err) {
    const msg = err.message || 'Server error';
    const isDbError = msg.includes('ECONNREFUSED') || msg.includes('MongoNetworkError') || msg.includes('buffering timed out') || err.name === 'MongoServerSelectionError';
    res.status(500).json({ status: 'error', message: isDbError ? 'Database not connected. Start MongoDB (open Compass, connect to mongodb://127.0.0.1:27017), then restart the backend.' : msg });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    const u = user.toObject();
    delete u.password;
    req.session.user = u;
    res.json({ status: 'ok', user: u });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ status: 'ok' });
});

app.get('/me', (req, res) => {
  if (!req.session.user) return res.status(401).json({ status: 'error' });
  res.json({ status: 'ok', user: req.session.user });
});

// Complaints (user submit, list own)
app.post('/submit-complaint', requireAuth, async (req, res) => {
  try {
    const { name, address, city, state, pincode, comment } = req.body;
    if (!name || !address || !city || !state || !pincode || !comment) return res.status(400).json({ status: 'error', message: 'Missing fields' });
    const complaint = await Complaint.create({
      userId: req.session.user._id,
      name,
      address,
      city,
      state,
      pincode,
      comment,
      status: 'pending'
    });
    res.json({ status: 'ok', complaint });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.get('/my-complaints', requireAuth, async (req, res) => {
  try {
    const list = await Complaint.find({ userId: req.session.user._id }).sort({ createdAt: -1 });
    res.json({ status: 'ok', complaints: list });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Admin: all complaints, all users, all agents, assign complaint
app.get('/admin/complaints', requireAuth, requireAdmin, async (req, res) => {
  try {
    const list = await Complaint.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.json({ status: 'ok', complaints: list });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.get('/admin/users', requireAuth, requireAdmin, async (req, res) => {
  try {
    const list = await User.find({ userType: 'customer' }).select('-password');
    res.json({ status: 'ok', users: list });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.get('/admin/agents', requireAuth, requireAdmin, async (req, res) => {
  try {
    const list = await User.find({ userType: 'agent' }).select('-password');
    res.json({ status: 'ok', agents: list });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.post('/admin/assign-complaint', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { complaintId, agentId } = req.body;
    if (!complaintId || !agentId) {
      return res.status(400).json({ status: 'error', message: 'complaintId and agentId are required' });
    }
    const agent = await User.findById(agentId).select('name');
    if (!agent) return res.status(400).json({ status: 'error', message: 'Agent not found' });
    const assigned = await AssignedComplaint.findOneAndUpdate(
      { complaintId },
      { complaintId, agentId, agentName: agent.name, status: 'assigned' },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    const complaint = await Complaint.findByIdAndUpdate(complaintId, { status: 'assigned' }, { new: true });
    if (!complaint) return res.status(404).json({ status: 'error', message: 'Complaint not found' });
    res.json({ status: 'ok', assigned, complaint });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Admin: directly update complaint status
app.put('/admin/complaint-status/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status || !status.trim()) {
      return res.status(400).json({ status: 'error', message: 'Status is required' });
    }
    const complaint = await Complaint.findByIdAndUpdate(id, { status: status.trim() }, { new: true });
    if (!complaint) {
      return res.status(404).json({ status: 'error', message: 'Complaint not found' });
    }
    res.json({ status: 'ok', complaint });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Agent: assigned complaints, update status, chat
app.get('/agent/complaints', requireAuth, requireAgent, async (req, res) => {
  try {
    const assigned = await AssignedComplaint.find({ agentId: req.session.user._id })
      .populate('complaintId')
      .sort({ createdAt: -1 });
    res.json({ status: 'ok', complaints: assigned });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.put('/agent/complaint-status/:id', requireAuth, requireAgent, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const ac = await AssignedComplaint.findOne({ complaintId: id, agentId: req.session.user._id });
    if (!ac) return res.status(404).json({ status: 'error', message: 'Not assigned to you' });
    await Complaint.findByIdAndUpdate(id, { status });
    res.json({ status: 'ok' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Chat
app.get('/chat/:complaintId', requireAuth, async (req, res) => {
  try {
    const messages = await ChatWindow.find({ complaintId: req.params.complaintId }).sort({ createdAt: 1 });
    res.json({ status: 'ok', messages });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.post('/chat/send', requireAuth, async (req, res) => {
  try {
    const { complaintId, message } = req.body;
    if (!complaintId || !message) return res.status(400).json({ status: 'error', message: 'Missing fields' });
    const doc = await ChatWindow.create({
      complaintId,
      name: req.session.user.name,
      message,
      senderId: req.session.user._id
    });
    res.json({ status: 'ok', message: doc });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

const PORT = config.port;
const mongoOptions = {
  serverSelectionTimeoutMS: 5000,
  family: 4 // Prefer IPv4 (helps on some Windows setups)
};
mongoose.connect(config.mongoURI, mongoOptions)
  .then(() => {
    console.log('MongoDB connected to database: complaintcare');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err.message);
    console.error('Connect MongoDB first: open MongoDB Compass and connect to mongodb://127.0.0.1:27017');
    process.exit(1);
  });
