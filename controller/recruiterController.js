import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../utils/firebaseConfiguration.js";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const requestAJobPosting = async (req, res) => {
  try {
    const {
      email,
      jobTitle,
      description,
      vacancy,
      location,
      qualification,
      experience,
    } = req.body;

    // Step 1: Fetch recruiter's document by email
    const recruiterRef = collection(db, "recruiters");
    const q = query(recruiterRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(403).json({ message: "No User Found, please relogin" });
    }

    const recruiterDoc = querySnapshot.docs[0];
    const recruiterDocRef = doc(db, "recruiters", recruiterDoc.id);
    const recruiterData = recruiterDoc.data();
    const requestId = uuidv4();

    // Step 2: Create new job object
    const newJob = {
      requestId,
      status: "pending",
      jobTitle,
      description,
      vacancy,
      location,
      qualification,
      experience,
    };

    // Step 3: Append job to jobPosted array
    const updatedJobs = Array.isArray(recruiterData.jobsRequested)
      ? [...recruiterData.jobsRequested, newJob]
      : [newJob];

    // Step 4: Update the document in Firestore
    await updateDoc(recruiterDocRef, {
      jobsRequested: updatedJobs,
    });

    // Step 5: Notify admin via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASS,
      },
    });

    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: `🆕 New Job Request: ${jobTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #2c3e50;">📢 New Job Posting Request</h2>
          <p>A new job posting has been requested by the recruiter. Below are the details:</p>

          <hr style="border: none; border-top: 1px solid #ccc;" />

          <h3>👤 Recruiter Details</h3>
          <ul>
            <li><strong>Name:</strong> ${recruiterData.contactPersonName || "N/A"}</li>
            <li><strong>Email:</strong> ${recruiterData.email}</li>
          </ul>

          <h3>💼 Job Details</h3>
          <ul>
            <li><strong>Title:</strong> ${jobTitle}</li>
            <li><strong>Description:</strong> ${description}</li>
            <li><strong>Location:</strong> ${location}</li>
            <li><strong>Qualification:</strong> ${qualification}</li>
            <li><strong>Experience:</strong> ${experience}</li>
            <li><strong>Vacancy:</strong> ${vacancy}</li>
            <li><strong>Status:</strong> Pending Approval</li>
          </ul>

          <p style="margin-top: 20px;">📌 Please review and approve the request in the admin panel.</p>
          <p>Regards,<br><strong>Career Portal</strong></p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res
      .status(200)
      .json({
        message: "Job request submitted and admin notified successfully.",
      });
  } catch (error) {
    console.error("Error requesting job posting:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getRecruiterJobs = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Step 1: Query the recruiter by email
    const recruiterRef = collection(db, "recruiters");
    const q = query(recruiterRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(404).json({ message: "Recruiter not found" });
    }

    const recruiterDoc = querySnapshot.docs[0];
    const recruiterData = recruiterDoc.data();

    // Step 2: Return the jobPosted array
    const jobPosted = recruiterData.jobsRequested || [];

    return res.status(200).json({ jobs: jobPosted });
  } catch (error) {
    console.error("Error fetching recruiter jobs:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteRequestedJob = async (req, res) => {
  try {
    const { requestId, email } = req.body;

    const recruiterRef = collection(db, "recruiters");
    const q = query(recruiterRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(404).json({ message: "Recruiter not found" });
    }

    const recruiterDoc = querySnapshot.docs[0];
    const recruiterDocRef = recruiterDoc.ref;
    const recruiterData = recruiterDoc.data();

    const jobPosted = recruiterData.jobsRequested || [];

    // Filter out the job with the matching requestId
    const updatedJobs = jobPosted.filter((job) => job.requestId !== requestId);

    // Update the Firestore document with the filtered array
    await updateDoc(recruiterDocRef, {
      jobsRequested: updatedJobs,
    });

    return res
      .status(200)
      .json({ message: "Job request deleted successfully" });
  } catch (error) {
    console.error("Error deleting requested job:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateRequestedJob = async (req, res) => {
  try {
    const { jobId, email, updatedData } = req.body;

    console.log("➡️ Incoming update request:", { jobId, email, updatedData });

    // Step 1: Find recruiter by email
    const recruiterRef = collection(db, "recruiters");
    const q = query(recruiterRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(404).json({ message: "Recruiter not found" });
    }

    const recruiterDoc = querySnapshot.docs[0];
    const recruiterDocRef = recruiterDoc.ref;
    const recruiterData = recruiterDoc.data();

    let jobsRequested = recruiterData.jobsRequested || [];

    // Step 2: Find the job by jobId
    const jobIndex = jobsRequested.findIndex((job) => job.requestId === jobId);
    if (jobIndex === -1) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Step 3: Update the specific job (log old and new for debug)
    const oldJob = jobsRequested[jobIndex];
    const updatedJob = {
      ...oldJob,
      ...updatedData, // ✅ Overwrite fields like `title`, `description`, etc.
    };

    console.log("🔁 Old Job:", oldJob);
    console.log("✅ New Job:", updatedJob);

    jobsRequested[jobIndex] = updatedJob;

    // Step 4: Write back updated array to Firestore
    await updateDoc(recruiterDocRef, {
      jobsRequested: jobsRequested,
    });

    // Step 5: Confirm write
    console.log("✅ Job updated successfully.");
    return res.status(200).json({ message: "Job updated successfully" });

  } catch (error) {
    console.error("❌ Error updating requested job:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

