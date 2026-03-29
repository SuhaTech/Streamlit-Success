const mongoose = require('mongoose');

const SharedReportSchema = new mongoose.Schema(
  {
    sharedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sharedByName: String,
    reportType: {
      type: String,
      enum: ['attendance'],
      default: 'attendance',
    },
    filterMode: {
      type: String,
      enum: ['single', 'all'],
      default: 'single',
    },
    filterDate: String,
    summary: {
      total: { type: Number, default: 0 },
      present: { type: Number, default: 0 },
      absent: { type: Number, default: 0 },
    },
    attendanceDetails: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        studentName: String,
        studentEmail: String,
        status: {
          type: String,
          enum: ['present', 'absent'],
        },
      },
    ],
    sharedWith: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('SharedReport', SharedReportSchema);
