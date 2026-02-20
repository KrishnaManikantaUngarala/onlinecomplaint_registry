const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  userType: { type: String, required: true, enum: ['customer', 'agent', 'admin'] }
}, { collection: 'user_Schema' });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

const complaintSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  comment: { type: String, required: true },
  status: { type: String, default: 'pending' }
}, { collection: 'complaint_schema', timestamps: true });

const assignedComplaintSchema = new mongoose.Schema({
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  complaintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', required: true },
  agentName: { type: String, required: true },
  status: { type: String, default: 'assigned' }
}, { collection: 'assigned_complaint', timestamps: true });

const chatWindowSchema = new mongoose.Schema({
  complaintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', required: true },
  name: { type: String, required: true },
  message: { type: String, required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { collection: 'message', timestamps: true });

const User = mongoose.model('User', userSchema);
const Complaint = mongoose.model('Complaint', complaintSchema);
const AssignedComplaint = mongoose.model('AssignedComplaint', assignedComplaintSchema);
const ChatWindow = mongoose.model('ChatWindow', chatWindowSchema);

module.exports = { User, Complaint, AssignedComplaint, ChatWindow };
