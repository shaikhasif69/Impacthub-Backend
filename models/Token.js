import mongoose from "mongoose";
const Schema = mongoose.Schema;

const TokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  points: { type: Number, default: 0 },
  redeemed: { type: Boolean, default: false },
  redeemDate: { type: Date },
});

module.exports = mongoose.model("Token", TokenSchema);
