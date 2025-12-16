import mongoose from "mongoose";

const offenseSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    studentClass: {
      type: String,
      required: true,
      trim: true,
    },

    caseType: {
      type: String,
      required: true,
      trim: true,
    },

    eventDateAndTime: {
      type: String, // you can change to Date later if needed
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    briefDescription: {
      type: String,
      required: true,
      trim: true,
    },

    witnessName: {
      type: String,
      required: true,
      trim: true,
    },

    parentNotified: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },

    disciplinaryAction: {
      type: [String], // better than plain Array
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Correct model name
const Offense = mongoose.model("Offense", offenseSchema);

export default Offense;
