import OffenseType from "../model/offenseTypeModel.js";
import AuditLog from "../model/auditLogModel.js";

export const createOffenseType = async (req, res) => {
  try {
    const offense = await OffenseType.create({
      ...req.body,
      createdBy: req.user?._id,
    });
    await AuditLog.create({
      user: req.user?._id,
      action: "create_offense_type",
      targetType: "OffenseType",
      targetId: offense._id,
      metadata: req.body,
    });
    res.status(201).json({ success: true, data: offense });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const listOffenseTypes = async (_req, res) => {
  const offenses = await OffenseType.find().sort({ createdAt: -1 });
  res.json({ success: true, data: offenses });
};

export const updateOffenseType = async (req, res) => {
  try {
    const updated = await OffenseType.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Not found" });
    await AuditLog.create({
      user: req.user?._id,
      action: "update_offense_type",
      targetType: "OffenseType",
      targetId: updated._id,
      metadata: req.body,
    });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteOffenseType = async (req, res) => {
  const deleted = await OffenseType.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Not found" });
  await AuditLog.create({
    user: req.user?._id,
    action: "delete_offense_type",
    targetType: "OffenseType",
    targetId: deleted._id,
  });
  res.json({ success: true, message: "Offense type deleted" });
};

