import DisciplineCase from "../model/caseModel.js";
import User from "../model/userModel.js";
import Notification from "../model/notificationModel.js";

export const createCase = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      reporter: req.user._id,
      status: req.user.role === "admin" ? "approved" : "pending",
    };

    // Sanitize empty strings for ObjectId/Date fields to avoid CastError
    const fieldsToSanitize = ["student", "teacher", "offenseType", "suggestedPunishment", "eventDate"];
    fieldsToSanitize.forEach(field => {
      if (payload[field] === "" || payload[field] === null) {
        payload[field] = undefined;
      }
    });

    const record = await DisciplineCase.create(payload);

    // Create notifications for committee and management
    const recipients = await User.find({ role: { $in: ["committee", "management", "admin"] } });
    const notificationPromises = recipients.map((user) => {
      if (user._id.toString() === req.user._id.toString()) return null;
      return Notification.create({
        recipient: user._id,
        caseId: record._id,
        message: `New disciplinary case filed by ${req.user.fullName}`,
      });
    });
    await Promise.all(notificationPromises.filter(p => p !== null));

    res.status(201).json({ success: true, data: record });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const listCases = async (req, res) => {
  let query = {};
  const { role, _id } = req.user;
  const userRole = (role || "").toLowerCase();
  
  if (userRole === "admin") {
    // Admin sees all cases
    query = {};
  } else if (userRole === "committee") {
    // Committee only sees student cases (including legacy docs without targetType)
    query = { targetType: { $in: ["student", null, undefined] } };
  } else if (userRole === "management" || userRole === "hod") {
    // HOD and Management see student and teacher cases
    query = { targetType: { $in: ["student", "teacher", null, undefined] } };
  } else if (userRole === "house_parent") {
    // House parents see their own boarding cases
    query = { reporter: _id, targetType: "boarding" };
  } else {
    // Other roles see their own cases
    query = { reporter: _id };
  }

  const cases = await DisciplineCase.find(query)
    .populate("student")
    .populate("teacher", "fullName picture")
    .populate("offenseType")
    .populate("suggestedPunishment")
    .populate("reporter", "fullName role");
  res.json({ success: true, data: cases });
};

export const getCase = async (req, res) => {
  const record = await DisciplineCase.findById(req.params.id)
    .populate("student")
    .populate("teacher", "fullName picture")
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

  const updates = { ...req.body };
  if (updates.offenseType === "") updates.offenseType = undefined;
  if (updates.suggestedPunishment === "") updates.suggestedPunishment = undefined;

  Object.assign(record, updates);
  await record.save();

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

  res.json({ success: true, data: record });
};

export const deleteCase = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }
  const record = await DisciplineCase.findByIdAndDelete(req.params.id);
  if (!record) return res.status(404).json({ message: "Case not found" });
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

  res.json({ success: true, data: record });
};

