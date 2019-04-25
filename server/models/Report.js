const mongoose = require('mongoose');

const { Schema } = mongoose;

const ReportSchema = new Schema({
  by: { type: Schema.Types.ObjectId, ref: 'User' },
  type: { type: String },
  reportedId: { type: Schema.Types.ObjectId, required: true },
  reason: { type: String, required: true },
  date: {
    type: Date,
    default: +new Date(),
  },
});

module.exports = mongoose.model('Report', ReportSchema);
