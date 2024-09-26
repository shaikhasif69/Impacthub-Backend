import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  driveId: { type: Schema.Types.ObjectId, ref: "Drive", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Chat", ChatSchema);
