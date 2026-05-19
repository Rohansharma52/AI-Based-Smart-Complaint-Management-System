const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true },
  email: {
    type: String, required: [true, 'Email is required'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
  },
  title: { type: String, required: [true, 'Title is required'], trim: true },
  description: { type: String, required: [true, 'Description is required'], trim: true },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Water Supply', 'Electricity', 'Roads', 'Sanitation', 'Public Safety', 'Healthcare', 'Education', 'Other']
  },
  location: { type: String, required: [true, 'Location is required'], trim: true },
  status: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' },
  // AI Analysis fields
  aiAnalysis: {
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: null },
    department: { type: String, default: null },
    summary: { type: String, default: null },
    autoResponse: { type: String, default: null }
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  createdAt: { type: Date, default: Date.now }
});

// Indexes for search
ComplaintSchema.index({ location: 'text', title: 'text', description: 'text' });
ComplaintSchema.index({ category: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('Complaint', ComplaintSchema);
