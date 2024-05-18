const express = require('express');
const mongoose = require('mongoose');
const { User } = require("../models/user");
const { Notification } = require("../models/notification");
const router = require('express').Router();
const { getIo } = require("../controllers/socket");  // Import the getIo function

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

    console.log(`Sending notification to user ${userId}: ${message}`);
    console.log(`Received notification: ${JSON.stringify(notification)}`);
    const io = getIo();  // Get the shared Socket.IO instance
    io.to(userId).emit('notification', notification);

    return { success: true, notification };
  } catch (error) {
    console.error('Error pushing notification:', error);
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

  const notifications = await Notification.find({ user: userId }).sort({ timeStamp: -1 });
  res.status(200).send(notifications);
});

module.exports = router;
