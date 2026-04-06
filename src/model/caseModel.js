import mongoose from "mongoose";

const caseSchema = new mongoose.Schema(
  {
    targetType: { 
      type: String, 
      enum: ["student", "teacher", "boarding"], 
      default: "student" 
    },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    offenseType: { type: mongoose.Schema.Types.ObjectId, ref: "OffenseType" },
    suspensionWeeks: { type: Number },
    parentCalled: { type: Boolean, default: false },
    permissionsCount: { type: Number },
    description: { type: String },
    eventDate: { type: Date },
    location: { type: String, trim: true },
    suggestedPunishment: { type: mongoose.Schema.Types.ObjectId, ref: "PunishmentTemplate" },
    status: {
      type: String,
      enum: ["draft", "pending", "approved", "resolved", "overridden"],
      default: "pending",
    },
    resolutionNotes: { type: String },
    isResolved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const DisciplineCase = mongoose.model("DisciplineCase", caseSchema);
export default DisciplineCase;


