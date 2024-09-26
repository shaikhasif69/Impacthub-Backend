import mongoose from "mongoose";
const Schema = mongoose.Schema;

const DriveSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  teamMembers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  chat: [{ type: Schema.Types.ObjectId, ref: 'Chat' }],
  media: [{ type: String }], // Array of file URLs (images, videos)
  liveStreamUrl: { type: String },
  certificates: [{ type: Schema.Types.ObjectId, ref: 'Certificate' }],
}, { timestamps: true });

export default mongoose.model("Drive", DriveSchema);