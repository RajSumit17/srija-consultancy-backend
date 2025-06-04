import { db } from "../utils/firebaseConfiguration.js";
import { collection, query, where, getDocs } from "firebase/firestore";

export const adminLoginController = async (req, res) => {
  try {
    res.json({
      message: "Login successful",
      email: req.user.email,
      name:"Admin"
    });
  } catch (error) {
    console.error("Login controller error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const candidateLoginController = async (req, res) => {
  try {
    const role = "candidate";
    const emailFromToken = req.user.email; // verified email from token
    // console.log(`candidate login ${emailFromToken}`);
    if (!emailFromToken) {
      return res.status(400).json({ message: "User email not found in token" });
    }

    // Query the "candidates" collection where the "email" field matches emailFromToken
    const candidatesRef = collection(db, "candidates");
    const q = query(candidatesRef, where("email", "==", emailFromToken));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res
        .status(403)
        .json({ message: `No candidate found` });
    }

    // Get the first matching document
    const userDoc = querySnapshot.docs[0];

    res.json({
      message: "Login successful",
      email: emailFromToken,
      userData: userDoc.data(),
      name: userDoc.data().name
    });
  } catch (error) {
    console.error("Login controller error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const recruiterLoginController = async (req, res) => {
  try {
    const role = "recruiter";
    const emailFromToken = req.user.email; // verified email from token

    if (!emailFromToken) {
      return res.status(400).json({ message: "User email not found in token" });
    }

    // Check if user exists under that role collection with this email as doc id
    const candidatesRef = collection(db, "recruiters");
    const q = query(candidatesRef, where("email", "==", emailFromToken));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res
        .status(403)
        .json({ message: `No recruiter found` });
    }

    // Get the first matching document
    const userDoc = querySnapshot.docs[0];

    res.json({
      message: "Login successful",
      email: emailFromToken,
      userData: userDoc.data(),
      name:userDoc.data().companyName
    });
  } catch (error) {
    console.error("Login controller error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
