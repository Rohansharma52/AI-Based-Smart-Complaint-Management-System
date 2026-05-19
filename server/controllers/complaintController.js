const Complaint = require('../models/Complaint');

// POST /api/complaints - Add complaint
exports.addComplaint = async (req, res) => {
  try {
    const { name, email, title, description, category, location } = req.body;
    if (!name || !email || !title || !description || !category || !location)
      return res.status(400).json({ success: false, message: 'All fields are required' });

    const complaint = await Complaint.create({
      name, email, title, description, category, location,
      userId: req.user?._id || null
    });

    res.status(201).json({ success: true, message: 'Complaint registered successfully!', data: complaint });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/complaints - Get all complaints
exports.getComplaints = async (req, res) => {
  try {
    const { category, status, page = 1, limit = 10, sort = '-createdAt' } = req.query;
    const query = {};
    if (category && category !== 'All') query.category = category;
    if (status && status !== 'All') query.status = status;

    // Non-admin users see only their complaints
    if (req.user && req.user.role !== 'admin') {
      query.$or = [{ userId: req.user._id }, { email: req.user.email }];
    }

    const total = await Complaint.countDocuments(query);
    const complaints = await Complaint.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      data: complaints,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/complaints/search?location=Ghaziabad
exports.searchByLocation = async (req, res) => {
  try {
    const { location, category, status } = req.query;
    if (!location) return res.status(400).json({ success: false, message: 'Location is required' });

    const query = { location: { $regex: location, $options: 'i' } };
    if (category && category !== 'All') query.category = category;
    if (status && status !== 'All') query.status = status;

    const complaints = await Complaint.find(query).sort('-createdAt').limit(50);
    res.json({ success: true, data: complaints, total: complaints.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/complaints/:id - Update complaint
exports.updateComplaint = async (req, res) => {
  try {
    const { status, aiAnalysis } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (aiAnalysis) updateData.aiAnalysis = aiAnalysis;

    const complaint = await Complaint.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });

    res.json({ success: true, message: 'Complaint updated successfully', data: complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/complaints/:id
exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
    res.json({ success: true, message: 'Complaint deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/complaints/stats - Dashboard stats
exports.getStats = async (req, res) => {
  try {
    const [total, pending, inProgress, resolved, byCategory] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'Pending' }),
      Complaint.countDocuments({ status: 'In Progress' }),
      Complaint.countDocuments({ status: 'Resolved' }),
      Complaint.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }, { $sort: { count: -1 } }])
    ]);
    res.json({ success: true, data: { total, pending, inProgress, resolved, byCategory } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
