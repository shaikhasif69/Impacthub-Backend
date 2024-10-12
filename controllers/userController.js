import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Drive from "../models/Drive.js";
import mongoose from "mongoose";
const JWT_SECRET = "IAMCUTE";

export const register = async (req, res) => {
  const { name, username, email, password } = req.body;

  try {
    console.log("hello ??");
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user : user
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const logout = (req, res) => {
  res.status(200).json({ message: "Logout successful" });
};

export const getUserProfile = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const user = await User.findById(req.params.id).populate(
      "certificates drives"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error); 
    res.status(500).json({ error: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  const { userId, name, username, profilePicture, location } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.username = username || user.username;
    user.profilePicture = profilePicture || user.profilePicture;
    user.location = location || user.location;

    await user.save();
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteProfile = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.remove();
    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// drives related :

export const joinDrive = async (req, res) => {
  const { id, driveId } = req.params;

  try {
    const user = await User.findById(id);
    const drive = await Drive.findById(driveId);

    if (!user || !drive) {
      return res.status(404).json({ message: "User or Drive not found" });
    }

    // Add the drive to the user's participation list if not already joined
    if (!user.drives.includes(driveId)) {
      user.drives.push(driveId);
      await user.save();
    }

    res.status(200).json({ message: "Successfully joined the drive" });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

export const getUserDrives = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).populate("drives");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ drives: user.drives });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

export const leaveDrive = async (req, res) => {
  const { id, driveId } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove the drive from the user's list of drives
    user.drives = user.drives.filter((d) => d.toString() !== driveId);
    await user.save();

    res.status(200).json({ message: "Successfully left the drive" });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// user certificates :

export const getUserCertificates = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ certificates: user.certificates });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// user notificatoin :

export const getUserNotifications = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ notifications: user.notifications });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
