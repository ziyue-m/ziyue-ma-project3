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
  imageUrl: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('StatusUpdate', StatusUpdateSchema);
