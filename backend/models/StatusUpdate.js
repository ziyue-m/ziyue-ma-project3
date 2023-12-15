const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Status Update Schema
const StatusUpdateSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  text: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  imageUrl: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('StatusUpdate', StatusUpdateSchema);
