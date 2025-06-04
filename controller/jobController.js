import { db } from "../utils/firebaseConfiguration.js";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export const addNewJobPosting = async (req, res) => {
  const {
    role,
    companyName,
    salary,
    jobType,
    location,
    experience,
    vacancy,
    description,
    qualification,
    responsibilities,
  } = req.body;

  const uniqueJobId = uuidv4();

  try {
    const docRef = await addDoc(collection(db, "jobs"), {
      uniqueJobId,
      companyName,
      role,
      salary,
      jobType,
      location,
      experience,
      vacancy,
      description,
      qualification,
      responsibility: responsibilities,
    });
    console.log("job added");
    return res.status(200).json({ message: "Job added successfully" });
  } catch (error) {
    console.log("failed");
    return res.status(500).json({ message: error.message });
  }
};

export const fetchAllJobs = async (req, res) => {
  try {
    const querySnapshot = await getDocs(collection(db, "jobs"));

    const jobs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({ jobs: jobs });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const getJob = async (req, res) => {
  try {
    const {companyName} = req.body;
    const jobsRef = collection(db, "jobs");
    const q = query(jobsRef, where("companyName", "==", companyName));
    const querySnapshot = await getDocs(q);
    // const querySnapshot = await getDocs(collection(db, "jobs"));
    console.log(companyName)
    const jobs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({ jobs: jobs });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const deleteJobs = async (req, res) => {
  const { uniqueJobId } = req.body;

  try {
    const jobsRef = collection(db, "jobs");
    const q = query(jobsRef, where("uniqueJobId", "==", uniqueJobId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(404).json({ message: "Job not found." });
    }

    // Delete all matching documents (just in case multiple exist with same uniqueJobId)
    const deletePromises = querySnapshot.docs.map((docSnap) =>
      deleteDoc(doc(db, "jobs", docSnap.id))
    );

    await Promise.all(deletePromises);

    return res.status(200).json({ message: "Job deleted successfully." });
  } catch (error) {
    console.error("Error deleting job:", error.message);
    return res.status(500).json({ message: "Failed to delete job." });
  }
};
