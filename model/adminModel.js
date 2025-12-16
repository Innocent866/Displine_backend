import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
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

    password: {
      type: String,
      minlength: 6,
      select: false, // do not return password by default
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
const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
