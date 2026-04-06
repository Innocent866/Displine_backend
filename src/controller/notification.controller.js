import Notification from "../model/notificationModel.js";

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate({
        path: "caseId",
        populate: [
          { path: "student" },
          { path: "teacher" }
        ]
      })
      .sort("-createdAt")
      .limit(50);
    res.json({ success: true, data: notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { isRead: true }
    );
    res.json({ success: true, message: "Marked all as read" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
