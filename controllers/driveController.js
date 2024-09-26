import Drive from "../models/Drive.js";
import User from "../models/User.js";

export const createDrive = async (req, res) => {
    console.log("drive Body : " + JSON.stringify(req.body))
  const {
    name,
    description,
    location,
    category,
    startDate,
    endDate,
    media,
    liveStreamUrl,
    maxParticipants,
  } = req.body;
  const creatorId = req.userId;
  console.log("creator ID : " + creatorId)

  try {
    const drive = new Drive({
      name,
      description,
      location,
      category,
      creator: creatorId,
      startDate,
      endDate,
      media,
      liveStreamUrl,
      maxParticipants,
    });

    await drive.save();

    await User.findByIdAndUpdate(creatorId, { $push: { drives: drive._id } });

    res.status(201).json({ message: "Drive created successfully", drive });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

export const getAllDrives = async (req, res) => {
  try {
    const drives = await Drive.find()
      .populate("creator", "name")
      .populate("participants", "name");
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
      .populate("participants", "name");
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
  const updates = req.body;

  try {
    const drive = await Drive.findByIdAndUpdate(id, updates, { new: true });
    if (!drive) {
      return res.status(404).json({ message: "Drive not found" });
    }
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
