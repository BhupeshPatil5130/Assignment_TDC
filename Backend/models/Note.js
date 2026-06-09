const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
    index: true
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: [true, 'Note content is required'],
    maxlength: 2000
  },
  type: {
    type: String,
    enum: ['call', 'meeting', 'note', 'follow-up'],
    default: 'note'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Note', noteSchema);
