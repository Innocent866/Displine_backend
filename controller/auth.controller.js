import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

const buildUserResponse = (user) => ({
  id: user._id,
  fullName: user.fullName,
  role: user.role,
  email: user.email,
});

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Find user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 2️⃣ Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3️⃣ Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      token,
      user: buildUserResponse(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ success: true, user: buildUserResponse(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updates = {
      fullName: req.body.fullName,
    };
    if (req.body.password) {
      updates.password = req.body.password;
    }

    const user = await User.findById(req.user.id).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    Object.assign(user, updates);
    await user.save();

    res.json({
      success: true,
      user: buildUserResponse(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};