import mongoose from "mongoose";
const Schema = mongoose.Schema;

// const ChatSchema = new Schema({
//   driveId: { type: Schema.Types.ObjectId, ref: "Drive", required: true },
//   userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
//   message: { type: String, required: true },
//   timestamp: { type: Date, default: Date.now },
// });

// export default mongoose.model("Chat", ChatSchema);


const ChatSchema = new Schema({
  driveId: { type: Schema.Types.ObjectId, ref: "Drive", required: false }, // For Drive-based chat
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Sender ID
  message: { type: String }, // Text message (optional if media exists)
  media: [{ type: String }], 
  reactions: [{ userId: { type: Schema.Types.ObjectId, ref: "User" }, type: String }], // Reaction (e.g., like, love, etc.)
  readBy: [{ type: Schema.Types.ObjectId, ref: "User" }], // Track which users have read the message
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Chat", ChatSchema);
