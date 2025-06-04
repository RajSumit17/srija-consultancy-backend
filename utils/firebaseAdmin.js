import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { config } from "dotenv";
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

config();

const app = initializeApp({
  credential: cert(serviceAccount),
});

export const adminAuth = getAuth(app);
