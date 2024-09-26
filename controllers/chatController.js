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
  
      // Simulate message sending and logging
      const newMessage = {
        from: id,
        to: toUserId,
        message,
        sentAt: new Date()
      };
  
      res.status(200).json({ message: "Message sent successfully", newMessage });
    } catch (error) {
      res.status(500).json({ error: "Server error", details: error.message });
    }
  };
  