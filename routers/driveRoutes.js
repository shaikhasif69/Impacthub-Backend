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
  addTeamMember,
  removeTeamMember,
  addParticipant,
  removeParticipant,
  getPopularDrives,
  getUpcomingDrives,
  getOngoingDrives,
  getDrivesByCategory,
  getCompletedDrivesLastWeek,
  getCompletedDrivesLastMonth,
} from "../controllers/driveController.js";

import upload from "../helpers/multer.js";


driveRouter.post("/create-drive", authMiddleware,  upload.array('driveImages'), createDrive);
driveRouter.get("/get-all-drive", authMiddleware, getAllDrives);
driveRouter.get("/get-drive-id/:id", authMiddleware, getDriveById);
driveRouter.patch("/update-drive/:id", authMiddleware, updateDrive);
driveRouter.delete("/delete-drive/:id", authMiddleware, deleteDrive);
driveRouter.post("/add-team-member/:id", authMiddleware, addTeamMember);
driveRouter.delete("/remove-team-member/:id", authMiddleware, removeTeamMember);
driveRouter.post("/add-participant/:id", authMiddleware, addParticipant);
driveRouter.delete(
  "/remove-participant/:id",
  authMiddleware,
  removeParticipant
);
driveRouter.get("/popular-drives", authMiddleware, getPopularDrives);
driveRouter.get("/upcoming-drives", authMiddleware, getUpcomingDrives);
driveRouter.get("/ongoing-drives", authMiddleware, getOngoingDrives);
driveRouter.get("/category/:category", authMiddleware, getDrivesByCategory);
driveRouter.get(
  "/completed-drives-last-week",
  authMiddleware,
  getCompletedDrivesLastWeek
);
driveRouter.get(
  "/completed-drives-last-month",
  authMiddleware,
  getCompletedDrivesLastMonth
);

