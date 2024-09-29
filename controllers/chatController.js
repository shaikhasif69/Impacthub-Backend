import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";

export const sendMessage = async (req, res) => {
  const { id } = req.params;
  const { toUserId, message } = req.body;

  try {
    const fromUser = await User.findById(id);
    const toUser = await User.findById(toUserId);

    if (!fromUser || !toUser) {
      return res.status(404).json({ message: "Sender or receiver not found" });
    }

    const newMessage = {
      from: id,
      to: toUserId,
      message,
      sentAt: new Date(),
    };

    res.status(200).json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

export const postDriveMessage = async (req, res) => {
  const { id } = req.params; // Drive ID
  const { userId, message } = req.body;

  try {
    const drive = await Drive.findById(id);
    if (!drive) {
      return res.status(404).json({ message: "Drive not found" });
    }

    // Create a new chat message
    const chatMessage = new Chat({
      user: userId,
      drive: id,
      message,
    });

    await chatMessage.save();
    drive.chat.push(chatMessage._id);
    await drive.save();

    res
      .status(201)
      .json({ message: "Message posted successfully", chatMessage });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

export const getDriveMessages = async (req, res) => {
  const { id } = req.params; // Drive ID
  const { page = 1, limit = 20 } = req.query;

  try {
    const drive = await Drive.findById(id);
    if (!drive) {
      return res.status(404).json({ message: "Drive not found" });
    }

    const messages = await Chat.find({ driveId: id })
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("userId", "name");

    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

export const sendMediaMessage = async (req, res) => {
  const { driveId, userId, mediaUrls } = req.body;

  try {
    const newMediaMessage = new Chat({
      driveId,
      userId,
      media: mediaUrls, // Array of media URLs
    });

    await newMediaMessage.save();

    res
      .status(201)
      .json({ message: "Media sent successfully", newMediaMessage });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

export const addReaction = async (req, res) => {
  const { messageId } = req.params;
  const { userId, reaction } = req.body;

  try {
    const message = await Chat.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    message.reactions.push({ userId, type: reaction });
    await message.save();

    res.status(200).json({ message: "Reaction added", message });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

export const markMessageAsRead = async (req, res) => {
  const { messageId } = req.params;
  const { userId } = req.body;

  try {
    const message = await Chat.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (!message.readBy.includes(userId)) {
      message.readBy.push(userId);
    }
    await message.save();

    res.status(200).json({ message: "Message marked as read", message });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

export const getUnreadMessages = async (req, res) => {
  const { userId } = req.params;

  try {
    const unreadMessages = await Chat.find({ readBy: { $ne: userId } })
      .populate("userId", "name")
      .sort({ timestamp: -1 });

    res.status(200).json({ unreadMessages });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
