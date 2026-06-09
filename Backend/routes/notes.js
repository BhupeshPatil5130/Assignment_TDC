const express = require('express');
const router = express.Router({ mergeParams: true }); 
const Note = require('../models/Note');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, async (req, res) => {
  try {
    const notes = await Note.find({ customerId: req.params.customerId })
      .sort({ createdAt: -1 });
    res.json({ success: true, data: notes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const note = await Note.create({
      customerId: req.params.customerId,
      authorId: req.user._id,
      authorName: req.user.name,
      content: req.body.content,
      type: req.body.type || 'note'
    });
    res.status(201).json({ success: true, data: note });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
