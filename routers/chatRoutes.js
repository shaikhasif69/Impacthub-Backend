import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { sendMessage, postDriveMessage, getDriveMessages, sendMediaMessage, addReaction, markMessageAsRead, getUnreadMessages } from "../controllers/chatController.js";
const chatRouter = express.Router();
export default chatRouter;


chatRouter.post("/send-message/:id", authMiddleware, sendMessage);
chatRouter.post("/post-drive-message/:id", authMiddleware, postDriveMessage);
chatRouter.get("/get-drive-messages/:id", authMiddleware, getDriveMessages);
chatRouter.post("/send-media-message", authMiddleware, sendMediaMessage);
chatRouter.post("/add-reaction/:messageId", authMiddleware, addReaction);
chatRouter.post("/mark-message-as-read/:messageId", authMiddleware, markMessageAsRead);
chatRouter.get("/get-unread-messages/:userId", authMiddleware, getUnreadMessages);
