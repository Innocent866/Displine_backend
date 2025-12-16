import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
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

// Hash password before save if modified
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Model name should be singular and capitalized
const User = mongoose.model("Users", UserSchema);

export default User;
