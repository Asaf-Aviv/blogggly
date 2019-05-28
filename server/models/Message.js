const mongoose = require('mongoose');

const { Schema } = mongoose;

const MessageSchema = new Schema({
  to: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  from: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  inBookmarks: {
    type: Boolean,
    default: false,
  },
  inTrash: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = MessageSchema;
