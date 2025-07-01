import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { config } from "dotenv";
import fs from 'fs';

// Use in production
const serviceAccount = JSON.parse(fs.readFileSync('/etc/secrets/serviceAccountKey.json', 'utf-8'));


// Used in development
// import serviceAccount from './serviceAccountKey.json' assert { type: 'json' };

config();

const app = initializeApp({
  credential: cert(serviceAccount),
});

export const adminAuth = getAuth(app);
