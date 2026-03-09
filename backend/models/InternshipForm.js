const mongoose = require("mongoose");

const internshipFormSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  department: { type: String, required: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional at first if assigned later, or default mentor
  companyName: { type: String, required: true },
  role: { type: String, required: true },
  stipend: { type: String, required: true }, // Using String to allow "10000" or "Unpaid"
  companyAddress: { type: String, required: true },
  joiningDate: { type: Date, required: true },
  internshipPeriod: { type: String, required: true }, // e.g., "6 months"
  extraDetails: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  internalGuide: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model("InternshipForm", internshipFormSchema);
