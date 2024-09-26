import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CertificateSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  driveId: { type: Schema.Types.ObjectId, ref: "Drive", required: true },
  issuedDate: { type: Date, default: Date.now },
  title: { type: String, required: true },
});

export default mongoose.model("Certificate", CertificateSchema);

