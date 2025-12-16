import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    role: {
      type: String,
      enum: ["admin", "committee"],
      default: "committee",
    },

    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },

    picture: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Model name should be singular and capitalized
const Member = mongoose.model("Member", memberSchema);

export default Member;
