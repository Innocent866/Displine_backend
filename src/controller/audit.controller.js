import AuditLog from "../model/auditLogModel.js";

export const listAuditLogs = async (_req, res) => {
  const logs = await AuditLog.find()
    .populate("user", "fullName role email")
    .sort({ createdAt: -1 })
    .limit(500);
  res.json({ success: true, data: logs });
};

export const deleteAuditLog = async (req, res) => {
  const result = await AuditLog.findByIdAndDelete(req.params.id);
  if (!result) return res.status(404).json({ message: "Log not found" });
  res.json({ success: true, message: "Audit log deleted" });
};

