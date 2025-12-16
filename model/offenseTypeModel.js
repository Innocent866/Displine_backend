import mongoose from "mongoose";

const offenseTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    pointValue: { type: Number, required: true, min: 0 },
    suggestedPunishments: [{ type: String }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  },
  { timestamps: true }
);

const OffenseType = mongoose.model("OffenseType", offenseTypeSchema);
export default OffenseType;

