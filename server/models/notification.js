const mongoose = require("mongoose");

// Define Notification Schema
const notificationSchema = new mongoose.Schema({
    message: { type: String, required: true },
    status: { type: String, enum: ['read', 'unread'], default: 'unread' },
    timeStamp: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Reference to User model
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = { Notification };
