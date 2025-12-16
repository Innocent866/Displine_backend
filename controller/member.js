import mongoose from "mongoose";
import User from "../model/userModel.js";
import Member from "../model/memberModel.js";

/**
 * CREATE MEMBER
 */
export const createMember = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { fullName, email, password, role, status, picture } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // 1️⃣ Create User (Auth) using save to ensure hooks run
    const user = new User({ fullName, email, password, role });
    await user.save({ session });

    // 2️⃣ Create Member (Profile)
    const member = new Member({
      user: user._id,
      fullName,
      email,
      role,
      status,
      picture,
    });
    await member.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Member created successfully",
      data: member,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({
      success: false,
      message: "Failed to create member",
      error: error.message,
    });
  }
};

export const getAllMembers = async (req, res) => {
    try {
    const members = await Member.find().populate("user", "role email");

    res.status(200).json({
      success: true,
      count: members.length,
      data: members,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch members",
      error: error.message,
    });
  }
};

  export const getMemberById = async (req, res) => {
    try {
      const member = await Member.findById(req.params.id).populate(
        "user",
        "email role"
      );
  
      if (!member) {
        return res.status(404).json({
          success: false,
          message: "Member not found",
        });
      }
  
      res.status(200).json({
        success: true,
        data: member,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch member",
        error: error.message,
      });
    }
  };

  export const updateMember = async (req, res) => {
    try {
      const updatedMember = await Member.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
  
      if (!updatedMember) {
        return res.status(404).json({
          success: false,
          message: "Member not found",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Member updated successfully",
        data: updatedMember,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update member",
        error: error.message,
      });
    }
  };

  export const deleteMember = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      const member = await Member.findById(req.params.id);
  
      if (!member) {
        return res.status(404).json({
          success: false,
          message: "Member not found",
        });
      }
  
      await User.findByIdAndDelete(member.user, { session });
      await Member.findByIdAndDelete(member._id, { session });
  
      await session.commitTransaction();
      session.endSession();
  
      res.status(200).json({
        success: true,
        message: "Member deleted successfully",
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
  
      res.status(500).json({
        success: false,
        message: "Failed to delete member",
        error: error.message,
      });
    }
  };
  