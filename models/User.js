import mongoose from "mongoose";

const Schema = mongoose.Schema; 
const userSchema = Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  role: {
    type: String,
    enum: ["common", "ngo"],
    default: "common",
  },
  drives: [{ type: Schema.Types.ObjectId, ref: "Drive", required : false }],
  certificates: [
    {
      driveId: { type: Schema.Types.ObjectId, ref: "Drive" },
      issuedAt: { type: Date, default: Date.now },
      certificateUrl: { type: String },
    },
  ],
  tokens: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  location: {
    type: { type: String, enum: ["Point"], required: false },
    coordinates: { type: [Number], required: false },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userSchema.index({ location: "2dsphere" });

export default mongoose.model("User", userSchema);