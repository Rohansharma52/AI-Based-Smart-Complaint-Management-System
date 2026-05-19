const express = require('express');
const router = express.Router();
const { chat, clearChat } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.post('/message', protect, chat);
router.post('/clear', protect, clearChat);

module.exports = router;
