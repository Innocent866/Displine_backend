import mongoose from "mongoose";

const punishmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    pointsRequired: { type: Number, required: true, min: 0 },
    durationDays: { type: Number, min: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  },
  { timestamps: true }
);

const PunishmentTemplate = mongoose.model(
  "PunishmentTemplate",
  punishmentSchema
);

export default PunishmentTemplate;

