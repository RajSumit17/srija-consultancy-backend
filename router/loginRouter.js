import { Router } from "express";
import { auth } from "../utils/firebaseConfiguration.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { adminLoginController, candidateLoginController, recruiterLoginController } from "../controller/loginController.js";

export const loginRouter = Router();

loginRouter.post("/admin",verifyToken,adminLoginController)
loginRouter.post("/candidate",verifyToken,candidateLoginController)
loginRouter.post("/recruiter",verifyToken,recruiterLoginController)
