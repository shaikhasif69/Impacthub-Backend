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
  searchUsers,
  getUserNotifications,
  getMyCreatedDrives,
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
userRouter.get("/get-my-drives/:id", authMiddleware, getMyCreatedDrives);

userRouter.get("/search-users", authMiddleware, searchUsers);

//drives related routes :

userRouter.post("/join-drive/:id/:driveId", authMiddleware, joinDrive);
userRouter.get("/get-drive/:id", authMiddleware, getUserDrives);
userRouter.delete("/drive/:id/leave/:id", authMiddleware, leaveDrive);

//certificates related routes here!

userRouter.get("/certificate/:id", authMiddleware, getUserCertificates);

// notification routes!

userRouter.get("/notification/:id", authMiddleware, getUserNotifications);
