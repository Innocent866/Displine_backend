import DisciplineCase from "../model/caseModel.js";
import AuditLog from "../model/auditLogModel.js";

export const createCase = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      reporter: req.user._id,
      status: req.user.role === "admin" ? "approved" : "pending",
    };
    const record = await DisciplineCase.create(payload);
    await AuditLog.create({
      user: req.user._id,
      action: "create_case",
      targetType: "DisciplineCase",
      targetId: record._id,
      metadata: payload,
    });
    res.status(201).json({ success: true, data: record });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const listCases = async (_req, res) => {
  const cases = await DisciplineCase.find()
    .populate("student")
    .populate("offenseType")
    .populate("suggestedPunishment")
    .populate("reporter", "fullName role");
  res.json({ success: true, data: cases });
};

export const getCase = async (req, res) => {
  const record = await DisciplineCase.findById(req.params.id)
    .populate("student")
    .populate("offenseType")
    .populate("suggestedPunishment")
    .populate("reporter", "fullName role");
  if (!record) return res.status(404).json({ message: "Case not found" });
  res.json({ success: true, data: record });
};

export const updateCase = async (req, res) => {
  const record = await DisciplineCase.findById(req.params.id);
  if (!record) return res.status(404).json({ message: "Case not found" });

  const isOwner = record.reporter.toString() === req.user._id.toString();
  const canEdit =
    req.user.role === "admin" || (isOwner && record.status === "pending");

  if (!canEdit) {
    return res
      .status(403)
      .json({ message: "Not allowed to edit this disciplinary case" });
  }

  Object.assign(record, req.body);
  await record.save();

  await AuditLog.create({
    user: req.user._id,
    action: "update_case",
    targetType: "DisciplineCase",
    targetId: record._id,
    metadata: req.body,
  });

  res.json({ success: true, data: record });
};

export const resolveCase = async (req, res) => {
  const record = await DisciplineCase.findById(req.params.id);
  if (!record) return res.status(404).json({ message: "Case not found" });

  const isOwner = record.reporter.toString() === req.user._id.toString();
  if (!(req.user.role === "admin" || isOwner)) {
    return res.status(403).json({ message: "Not allowed to resolve case" });
  }

  record.status = "resolved";
  record.isResolved = true;
  record.resolutionNotes = req.body.resolutionNotes;
  await record.save();

  await AuditLog.create({
    user: req.user._id,
    action: "resolve_case",
    targetType: "DisciplineCase",
    targetId: record._id,
    metadata: req.body,
  });

  res.json({ success: true, data: record });
};

export const approveCase = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }

  const record = await DisciplineCase.findById(req.params.id);
  if (!record) return res.status(404).json({ message: "Case not found" });

  record.status = "approved";
  await record.save();

  await AuditLog.create({
    user: req.user._id,
    action: "approve_case",
    targetType: "DisciplineCase",
    targetId: record._id,
    metadata: { previousStatus: record.status },
  });

  res.json({ success: true, data: record });
};

export const deleteCase = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }
  const record = await DisciplineCase.findByIdAndDelete(req.params.id);
  if (!record) return res.status(404).json({ message: "Case not found" });
  await AuditLog.create({
    user: req.user._id,
    action: "delete_case",
    targetType: "DisciplineCase",
    targetId: record._id,
  });
  res.json({ success: true, message: "Case deleted" });
};

export const unapproveCase = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }

  const record = await DisciplineCase.findById(req.params.id);
  if (!record) return res.status(404).json({ message: "Case not found" });

  if (record.status !== "approved") {
     return res.status(400).json({ message: "Case is not in approved status" });
  }

  record.status = "pending";
  await record.save();

  await AuditLog.create({
    user: req.user._id,
    action: "unapprove_case",
    targetType: "DisciplineCase",
    targetId: record._id,
    metadata: { previousStatus: "approved" },
  });

  res.json({ success: true, data: record });
};

export const unresolveCase = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }

  const record = await DisciplineCase.findById(req.params.id);
  if (!record) return res.status(404).json({ message: "Case not found" });

  if (!record.isResolved) {
     return res.status(400).json({ message: "Case is not resolved" });
  }

  record.status = "approved";
  record.isResolved = false;
  record.resolutionNotes = undefined;
  await record.save();

  await AuditLog.create({
    user: req.user._id,
    action: "unresolve_case",
    targetType: "DisciplineCase",
    targetId: record._id,
    metadata: { previousStatus: "resolved" },
  });

  res.json({ success: true, data: record });
};

