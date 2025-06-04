import { adminAuth } from "../utils/firebaseAdmin.js";

export const verifyToken = async (req, res, next) => {
  const token =
    req.body.token || req.headers.authorization?.split("Bearer ")[1];

  if (!token) {
    console.log("No token provided")
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken; // attach user info
    // console.log("token "+token)
    next();
  } catch (error) {
    console.log("Unauthorized")
    return res
      .status(403)
      .json({ message: "Unauthorized", error: error.message });
  }
};
