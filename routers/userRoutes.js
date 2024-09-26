import express from "express";
import { register, login, logout, getUserProfile, updateProfile, deleteProfile } from '../controllers/userController.js';
import {authMiddleware} from "../middleware/authMiddleware.js";
const userRouter = express.Router();
export default userRouter;

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/logout", logout);

userRouter.get("/profile/:id", authMiddleware, getUserProfile);
userRouter.put("/profile/update", authMiddleware, updateProfile);
userRouter.delete("/profile/delete", authMiddleware, deleteProfile);

