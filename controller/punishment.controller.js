import PunishmentTemplate from "../model/punishmentModel.js";
import AuditLog from "../model/auditLogModel.js";

export const createPunishment = async (req, res) => {
  try {
    const punishment = await PunishmentTemplate.create({
      ...req.body,
      createdBy: req.user?._id,
    });
    await AuditLog.create({
      user: req.user?._id,
      action: "create_punishment",
      targetType: "PunishmentTemplate",
      targetId: punishment._id,
      metadata: req.body,
    });
    res.status(201).json({ success: true, data: punishment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const listPunishments = async (_req, res) => {
  const list = await PunishmentTemplate.find().sort({ createdAt: -1 });
  res.json({ success: true, data: list });
};

export const updatePunishment = async (req, res) => {
  try {
    const updated = await PunishmentTemplate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Not found" });
    await AuditLog.create({
      user: req.user?._id,
      action: "update_punishment",
      targetType: "PunishmentTemplate",
      targetId: updated._id,
      metadata: req.body,
    });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deletePunishment = async (req, res) => {
  const deleted = await PunishmentTemplate.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Not found" });
  await AuditLog.create({
    user: req.user?._id,
    action: "delete_punishment",
    targetType: "PunishmentTemplate",
    targetId: deleted._id,
  });
  res.json({ success: true, message: "Punishment removed" });
};

