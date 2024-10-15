import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ParticipantSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    driveId: { type: Schema.Types.ObjectId, ref: "Drive", required: true },
    attended: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Participant", ParticipantSchema);
