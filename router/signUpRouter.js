import { Router } from "express";
import upload from "../middleware/upload.js";
import { candidateSignUp, recruiterSignUp } from "../controller/signUpController.js";
export const signUpRouter = Router();

// signUpRouter
signUpRouter.use("/candidate",upload.single("resume"),candidateSignUp)

// recruiter Signup
signUpRouter.use("/recruiter",upload.none(),recruiterSignUp);