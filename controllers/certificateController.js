import Certificate from "../models/Certificate";
import User from "../models/User";
import Drive from "../models/Drive";
import Participant from "../models/Participants"; 
import { sendCertificateEmail } from "../emailService";

export const issueCertificates = async (req, res) => {
  try {
    const { driveId, attendeeIds, role } = req.body;

    const drive = await Drive.findById(driveId);
    if (!drive) {
      return res.status(404).json({ message: "Drive not found" });
    }

    if (drive.status !== 'completed') {
      return res.status(400).json({ message: "Drive not yet completed" });
    }

    for (const userId of attendeeIds) {
      const participant = await Participant.findOne({ userId, driveId });

      if (participant && participant.attended) {
        const certificate = new Certificate({
          userId,
          driveId,
          title: `${drive.name} Completion Certificate`,
          role: role || 'participant',
          certificateUrl: generateCertificateUrl(userId, driveId), 
        });

        await certificate.save();

        await User.findByIdAndUpdate(userId, {
          $push: { certificates: { driveId, certificateUrl: certificate.certificateUrl } },
        });

        const user = await User.findById(userId);
        sendCertificateEmail(user.email, certificate.certificateUrl, drive.name);
      }
    }

    return res.status(200).json({ message: "Certificates issued successfully" });

  } catch (error) {
    return res.status(500).json({ message: "Error issuing certificates", error });
  }
};

// URL generator function for certificates
const generateCertificateUrl = (userId, driveId) => {
  return `https://certificates.example.com/${userId}/${driveId}`;
};
