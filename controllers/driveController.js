import Drive from "../models/Drive.js";
import User from "../models/User.js";
import cloudinary from "../helpers/cloudinary.js";
import multer from "multer";
import Participant from "../models/Participants.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const createDrive = async (req, res) => {
  console.log("Drive Body: " + JSON.stringify(req.body));
  const {
    name,
    description,
    location,
    category,
    startDate,
    endDate,
    maxParticipants,
    isDonate,
    // teamMembers,
    
  } = req.body;
  const teamMembers = req.body.teamMembers.map(id => mongoose.Types.ObjectId(id));
  const creatorId = req.userId;
  console.log("Creator ID: " + creatorId);

  try {
    const driveImages = await Promise.all(
      req.files.map((file) => {
        return new Promise((resolve, reject) => {
          cloudinary.v2.uploader
            .upload_stream(
              {
                folder: "drives",
                resource_type: "auto",
              },
              (error, result) => {
                if (error) {
                  reject(new Error(error.message));
                } else {
                  resolve(result.secure_url);
                }
              }
            )
            .end(file.buffer);
        });
      })
    );

    const drive = new Drive({
      name,
      description,
      location,
      category,
      creator: creatorId,
      startDate,
      endDate,
      driveImages,
      maxParticipants,
      isDonate,
      teamMembers,
      selectedUserIds,
    });

    await drive.save();

    await User.findByIdAndUpdate(creatorId, { $push: { drives: drive._id } });
    console.log("created drive: " + drive);

    res.status(201).json({ message: "Drive created successfully", drive });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// get drives related api's here!
export const getAllDrives = async (req, res) => {
  try {
    const drives = await Drive.find()
      .populate("creator", "name")
      .populate("participants", "name username email"); // Populate participant details from the User model

    // Fetch attendance data for participants
    const drivesWithAttendance = await Promise.all(
      drives.map(async (drive) => {
        const participantsWithAttendance = await Promise.all(
          drive.participants.map(async (participant) => {
            const participantData = await Participant.findOne({
              userId: participant._id,
              driveId: drive._id,
            });
            return {
              ...participant.toObject(),
              attended: participantData ? participantData.attended : false, // Add attendance info
            };
          })
        );
        return {
          ...drive.toObject(),
          participants: participantsWithAttendance,
        };
      })
    );

    res.status(200).json({ drives: drivesWithAttendance });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

export const getPopularDrives = async (req, res) => {
  try {
    const drives = await Drive.find()
      .sort({ participants: -1 })
      .limit(10)
      .populate("creator", "name")
      .populate({
        path: "participants",
        model: "Participant",
        populate: {
          path: "userId",
          select: "name username email",
        },
      });

    res.status(200).json({ drives });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

export const getUpcomingDrives = async (req, res) => {
  try {
    const currentDate = new Date();
    const drives = await Drive.find({ startDate: { $gt: currentDate } })
      .sort({ startDate: 1 })
      .populate("creator", "name")
      .populate({
        path: "participants",
        model: "Participant",
        populate: {
          path: "userId",
          select: "name username email",
        },
      });

    res.status(200).json({ drives });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

export const getOngoingDrives = async (req, res) => {
  try {
    const currentDate = new Date();
    const drives = await Drive.find({
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
    })
      .populate("creator", "name")
      .populate({
        path: "participants",
        model: "Participant",
        populate: {
          path: "userId",
          select: "name username email",
        },
      });

    res.status(200).json({ drives });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

export const getDrivesByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const drives = await Drive.find({ category })
      .populate("creator", "name")
      .populate({
        path: "participants",
        model: "Participant",
        populate: {
          path: "userId",
          select: "name username email",
        },
      });

    res.status(200).json({ drives });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

export const getCompletedDrivesLastWeek = async (req, res) => {
  try {
    const currentDate = new Date();
    const lastWeekDate = new Date(currentDate);
    lastWeekDate.setDate(currentDate.getDate() - 7);

    const drives = await Drive.find({
      endDate: { $lte: currentDate, $gte: lastWeekDate },
    })
      .populate("creator", "name")
      .populate({
        path: "participants",
        model: "Participant",
        populate: {
          path: "userId",
          select: "name username email",
        },
      });

    res.status(200).json({ drives });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

export const getCompletedDrivesLastMonth = async (req, res) => {
  try {
    const currentDate = new Date();
    const lastMonthDate = new Date(currentDate);
    lastMonthDate.setMonth(currentDate.getMonth() - 1);

    const drives = await Drive.find({
      endDate: { $lte: currentDate, $gte: lastMonthDate },
    })
      .populate("creator", "name")
      .populate({
        path: "participants",
        model: "Participant",
        populate: {
          path: "userId",
          select: "name username email",
        },
      });

    res.status(200).json({ drives });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

export const getDriveById = async (req, res) => {
  const { id } = req.params;

  try {
    const drive = await Drive.findById(id)
      .populate("creator", "name")
      .populate({
        path: "participants",
        model: "Participant",
        populate: {
          path: "userId",
          select: "name username email",
        },
      });
    if (!drive) {
      return res.status(404).json({ message: "Drive not found" });
    }
    res.status(200).json({ drive });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

export const updateDrive = async (req, res) => {
  const { id } = req.params;
  const { status, attendeeIds } = req.body;

  try {
    const drive = await Drive.findById(id);
    if (!drive) {
      return res.status(404).json({ message: "Drive not found" });
    }

    if (status === "completed") {
      if (!attendeeIds || attendeeIds.length === 0) {
        return res.status(400).json({
          message:
            "Attendee IDs must be provided to mark the drive as completed",
        });
      }

      for (const userId of attendeeIds) {
        await Participant.updateOne(
          { userId, driveId: id },
          { attended: true }
        );
      }
    }

    drive.status = status || drive.status;
    await drive.save();

    res.status(200).json({ message: "Drive updated successfully", drive });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

export const deleteDrive = async (req, res) => {
  const { id } = req.params;

  try {
    const drive = await Drive.findByIdAndDelete(id);
    if (!drive) {
      return res.status(404).json({ message: "Drive not found" });
    }
    res.status(200).json({ message: "Drive deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

export const addTeamMember = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const drive = await Drive.findById(id);
    if (!drive) {
      return res.status(404).json({ message: "Drive not found" });
    }
    if (drive.teamMembers.includes(userId)) {
      return res.status(400).json({ message: "User is already a team member" });
    }

    drive.teamMembers.push(userId);
    await drive.save();

    res.status(200).json({ message: "Team member added successfully", drive });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// Remove a team member
export const removeTeamMember = async (req, res) => {
  const { id, userId } = req.params;

  try {
    const drive = await Drive.findById(id);
    if (!drive) {
      return res.status(404).json({ message: "Drive not found" });
    }

    drive.teamMembers = drive.teamMembers.filter(
      (member) => member.toString() !== userId
    );
    await drive.save();

    res
      .status(200)
      .json({ message: "Team member removed successfully", drive });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// Add a participant to a drive
export const addParticipant = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const drive = await Drive.findById(id);
    if (!drive) {
      return res.status(404).json({ message: "Drive not found" });
    }

    // Check if user is already a participant
    if (drive.participants.includes(userId)) {
      return res.status(400).json({ message: "User is already a participant" });
    }

    drive.participants.push(userId);
    await drive.save();

    res.status(200).json({ message: "Participant added successfully", drive });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// Remove a participant from a drive
export const removeParticipant = async (req, res) => {
  const { id, userId } = req.params;

  try {
    const drive = await Drive.findById(id);
    if (!drive) {
      return res.status(404).json({ message: "Drive not found" });
    }

    drive.participants = drive.participants.filter(
      (participant) => participant.toString() !== userId
    );
    await drive.save();

    res
      .status(200)
      .json({ message: "Participant removed successfully", drive });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// this function will be responsible for marking the participants as attended
export const markAttendance = async (req, res) => {
  try {
    const { driveId, attendeeIds } = req.body;

    const drive = await Drive.findById(driveId);
    if (!drive) {
      return res.status(404).json({ message: "Drive not found" });
    }

    attendeeIds.forEach(async (userId) => {
      const participant = drive.participants.find(
        (p) => p.userId.toString() === userId
      );
      if (participant) {
        participant.attended = true;
      }
    });

    await drive.save();

    return res.status(200).json({ message: "Attendance marked successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error marking attendance", error });
  }
};
