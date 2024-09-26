import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
const driveRouter = express.Router();
export default driveRouter;
import {
  createDrive,
  getDriveById,
  getAllDrives,
  updateDrive,
  deleteDrive,
} from "../controllers/driveController.js";

driveRouter.post("/create-drive", authMiddleware, createDrive);
driveRouter.get("/get-all-drive", authMiddleware, getAllDrives);
driveRouter.get("/get-drive-id/:id", authMiddleware, getDriveById);
driveRouter.patch("/update-drive/:id", authMiddleware, updateDrive);
driveRouter.delete("/delete-drive/:id", authMiddleware, deleteDrive);
