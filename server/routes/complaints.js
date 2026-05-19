const express = require('express');
const router = express.Router();
const {
  addComplaint, getComplaints, updateComplaint,
  deleteComplaint, searchByLocation, getStats
} = require('../controllers/complaintController');
const { protect, adminOnly } = require('../middleware/auth');

// Public + protected
router.get('/search', protect, searchByLocation);
router.get('/stats', protect, getStats);
router.get('/', protect, getComplaints);
router.post('/', protect, addComplaint);
router.put('/:id', protect, updateComplaint);
router.delete('/:id', protect, deleteComplaint);

module.exports = router;
