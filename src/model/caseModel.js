import mongoose from "mongoose";

const caseSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    offenseType: { type: mongoose.Schema.Types.ObjectId, ref: "OffenseType" },
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

