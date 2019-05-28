const mongoose = require('mongoose');

const { Schema } = mongoose;

const NotificationSchema = new Schema({
  body: {
    type: String,
    required: true,
  },
  from: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = NotificationSchema;
