import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    studentId: { type: String, required: true, unique: true, trim: true },
    className: { type: String, required: true, trim: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);
export default Student;

