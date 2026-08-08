const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    targetId: { type: mongoose.Schema.Types.ObjectId, default: null },
    targetType: { type: String, default: '' },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

module.exports = mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
