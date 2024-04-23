const router = require("express").Router();
const { User } = require("../models/user");
const { Notification } = require("../models/notification");

// Method to push a notification to a specific user
const pushNotification = async (userId, message) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, message: "User not found" };
    }

    const notification = new Notification({
      message,
      user: userId
    });
    await notification.save();
    return { success: true, notification };
  } catch (error) {
    console.error('Error pushing notification:', error);
    return { success: false, message: "Internal Server Error" };
  }
};

// Method to get notifications for a specific user
const getNotifications = async (userId) => {
  try {
    const notifications = await Notification.find({ user: userId }).sort({ timeStamp: -1 });
    return { success: true, notifications };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return { success: false, message: "Internal Server Error" };
  }
};

// Route to push a notification to a specific user
router.post("/push/:userId", async (req, res) => {
  const { userId } = req.params;
  const { message } = req.body;

  const result = await pushNotification(userId, message);
  if (result.success) {
    res.status(201).send({ message: "Notification sent successfully", notification: result.notification });
  } else {
    res.status(500).send({ message: result.message });
  }
});

// Route to get notifications for a specific user
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  const result = await getNotifications(userId);
  if (result.success) {
    res.status(200).send(result.notifications);
  } else {
    res.status(500).send({ message: result.message });
  }
});

module.exports = router;
