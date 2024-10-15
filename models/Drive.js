import mongoose from "mongoose";
const Schema = mongoose.Schema;

const DriveSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, required: false },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    driveImages: {
      type: [String],
      default: [],
    },
    teamMembers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' ,  required : false}],
    // // participants: [
    // //   {  userId: { type: Schema.Types.ObjectId, ref: 'User' , required: false },
    // //   attended: { type: Boolean, default: false }, 
    // // },
    // ],
    chat: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
    media: [{ type: String, required: false }],
    liveStreamUrl: { type: String, required: false },
    certificates: [{ type: Schema.Types.ObjectId, ref: "Certificate" }],
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
    maxParticipants: { type: Number, default: 50 },
  },
  { timestamps: true }
);

export default mongoose.model("Drive", DriveSchema);
