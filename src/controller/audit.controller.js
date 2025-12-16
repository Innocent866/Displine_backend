import AuditLog from "../model/auditLogModel.js";

export const listAuditLogs = async (_req, res) => {
  const logs = await AuditLog.find()
    .populate("user", "fullName role email")
    .sort({ createdAt: -1 })
    .limit(500);
  res.json({ success: true, data: logs });
};

