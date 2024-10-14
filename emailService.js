import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "atharva.atwork45@gmail.com",
    pass: "gppcjkpguxztrrhw", // Use environment variables in production for security
  },
});

export const sendCertificateEmail = (email, certificateUrl, driveName) => {
  const mailOptions = {
    from: "atharva.atwork45@gmail.com",
    to: email,
    subject: `Your Certificate for Completing ${driveName}!`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; padding: 20px;">
        <h2 style="color: #4CAF50;">Congratulations!</h2>
        <p>Dear Participant,</p>
        <p>
          Thank you for your contribution and participation in the drive <strong>${driveName}</strong>.
          We are delighted to inform you that your certificate for completing the drive is now ready!
        </p>
        <p>
          <a href="${certificateUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Download Your Certificate
          </a>
        </p>
        <p>
          You can view or download your certificate by clicking the button above. Keep up the great work, and we hope to see you in future drives!
        </p>
        <p>
          Best regards,<br/>
          The ImpactHub Team
        </p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.log("Error in sending certificate email", err);
    } else {
      console.log("Sent certificate successfully to: " + email);
    }
  });
};

// module.exports = sendCertificateEmail;
