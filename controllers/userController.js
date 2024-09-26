import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Drive from "../models/Drive.js";
import mongoose from "mongoose";
const JWT_SECRET = "IAMCUTE";

export const register = async (req, res) => {
  const { name, username, email, password, role } = req.body;

  try {
    // Check if the user already exists
    console.log("hello ??")
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
      role,
    });

    // Save the new user in the database
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    // Log the actual error to get more insight
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
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
      },
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
    console.error("Error fetching user profile:", error); // Log the error
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
