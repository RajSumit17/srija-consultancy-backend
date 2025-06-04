import express from "express";
import nodemailer from "nodemailer";
import { db } from "../utils/firebaseConfiguration.js";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/notify-interest", async (req, res) => {
  try {
    const { jobId, candidateEmail } = req.body;

    // Query jobs where jobId == jobId
    const jobsRef = collection(db, "jobs");
    const jobQuery = query(jobsRef, where("uniqueJobId", "==", jobId));
    const jobSnapshot = await getDocs(jobQuery);

    if (jobSnapshot.empty) {
      return res.status(404).json({ message: "Job not found" });
    }

    const jobDoc = jobSnapshot.docs[0];
    const job = jobDoc.data();

    // Query candidates where email == candidateEmail
    const candidatesRef = collection(db, "candidates");
    const candidateQuery = query(candidatesRef, where("email", "==", candidateEmail));
    const candidateSnapshot = await getDocs(candidateQuery);

    if (candidateSnapshot.empty) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const candidateDoc = candidateSnapshot.docs[0];
    const candidate = candidateDoc.data();

    // Setup Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASS,
      },
    });

    const mailOptions = {
      from:process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: `Candidate Interested in ${job.role}`,
      html: `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color: #2c3e50;">📩 Candidate Interest Notification</h2>

    <p>A candidate has expressed interest in the following job opportunity. Please find their details below:</p>

    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />

    <h3 style="color: #34495e;">👤 Candidate Details</h3>
    <table cellspacing="0" cellpadding="5" style="border-collapse: collapse;">
      <tr>
        <td><strong>Name:</strong></td>
        <td>${candidate.name}</td>
      </tr>
      <tr>
        <td><strong>Email:</strong></td>
        <td>${candidate.email}</td>
      </tr>
      <tr>
        <td><strong>Resume:</strong></td>
        <td><a href="${candidate.resumeURL}" target="_blank" style="color: #2980b9;">View Resume</a></td>
      </tr>
    </table>

    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />

    <h3 style="color: #34495e;">💼 Job Description</h3>
    <table cellspacing="0" cellpadding="5" style="border-collapse: collapse;">
      <tr>
        <td><strong>Company:</strong></td>
        <td>${job.companyName}</td>
      </tr>
      <tr>
        <td><strong>Role:</strong></td>
        <td>${job.role}</td>
      </tr>
      <tr>
        <td><strong>Location:</strong></td>
        <td>${job.location}</td>
      </tr>
      <tr>
        <td><strong>Experience:</strong></td>
        <td>${job.experience}</td>
      </tr>
      <tr>
        <td><strong>Salary:</strong></td>
        <td>${job.salary}</td>
      </tr>
      <tr>
        <td><strong>Job Type:</strong></td>
        <td>${job.jobType}</td>
      </tr>
      <tr>
        <td><strong>Vacancy:</strong></td>
        <td>${job.vacancy}</td>
      </tr>
      <tr>
        <td style="vertical-align: top;"><strong>Description:</strong></td>
        <td>${job.description}</td>
      </tr>
      <tr>
        <td style="vertical-align: top;"><strong>Qualification:</strong></td>
        <td>${job.qualification}</td>
      </tr>
      <tr>
        <td style="vertical-align: top;"><strong>Responsibilities:</strong></td>
        <td>${job.responsibility}</td>
      </tr>
    </table>

    <p style="margin-top: 30px;">Regards,<br><strong>Career Portal</strong></p>
  </div>
`,

    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Email sent successfully" });
  } catch (err) {
    console.error("Error sending interest email:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
