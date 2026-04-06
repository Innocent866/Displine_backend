import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    caseId: { type: mongoose.Schema.Types.ObjectId, ref: "DisciplineCase", required: true },
    type: { type: String, enum: ["new_case", "update"], default: "new_case" },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
