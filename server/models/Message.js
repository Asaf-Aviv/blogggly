const mongoose = require('mongoose');

const { Schema } = mongoose;

const MessageSchema = new Schema({
  to: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  from: {
    type: Schema.Types.ObjectId,
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
}, { timestamps: true });

module.exports = MessageSchema;
