import Student from "../model/studentModel.js";
import AuditLog from "../model/auditLogModel.js";

export const createStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);
    await AuditLog.create({
      user: req.user?._id,
      action: "create_student",
      targetType: "Student",
      targetId: student._id,
      metadata: req.body,
    });
    res.status(201).json({ success: true, data: student });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getStudents = async (_req, res) => {
  const students = await Student.find().sort({ createdAt: -1 });
  res.json({ success: true, count: students.length, data: students });
};

export const getStudent = async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ message: "Student not found" });
  res.json({ success: true, data: student });
};

export const updateStudent = async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Student not found" });
    await AuditLog.create({
      user: req.user?._id,
      action: "update_student",
      targetType: "Student",
      targetId: updated._id,
      metadata: req.body,
    });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) return res.status(404).json({ message: "Student not found" });
  await AuditLog.create({
    user: req.user?._id,
    action: "delete_student",
    targetType: "Student",
    targetId: student._id,
  });
  res.json({ success: true, message: "Student removed" });
};

