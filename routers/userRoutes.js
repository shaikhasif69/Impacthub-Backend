import express from "express";
import {
  register,
  login,
  logout,
  getUserProfile,
  updateProfile,
  deleteProfile,
  joinDrive,
  getUserDrives,
  leaveDrive,
  getUserCertificates,
  getUserNotifications,
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const userRouter = express.Router();
export default userRouter;

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/logout", logout);

userRouter.get("/profile/:id", authMiddleware, getUserProfile);
userRouter.put("/profile/update", authMiddleware, updateProfile);
userRouter.delete("/profile/delete", authMiddleware, deleteProfile);

//drives related routes :

userRouter.post("/drive/:id/join/:id", authMiddleware, joinDrive);
userRouter.get("/drive/:id", authMiddleware, getUserDrives);
userRouter.delete("/drive/:id/leave/:id", authMiddleware, leaveDrive);

//certificates related routes here!

userRouter.get("/certificate/:id", authMiddleware, getUserCertificates);

// notification routes!

userRouter.get("/notification/:id", authMiddleware, getUserNotifications);
