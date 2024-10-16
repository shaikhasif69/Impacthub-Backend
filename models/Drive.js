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
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    chat: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
    media: [{ type: String }],
    liveStreamUrl: { type: String },
    certificates: [{ type: Schema.Types.ObjectId, ref: "Certificate" }],
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
    maxParticipants: { type: Number, default: 50 },

    isDonate: { type: Boolean, default: false },
    donationMethodSeek: {
      type: [String],
      enum: ["Goods", "Money", "Both", "None"],
      default: [], 
    },
    donations: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        type: { type: String, enum: ["goods", "money"], required: true },
        amount: { type: Number }, 
        goodsDescription: { type: String }, 
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Drive", DriveSchema);
