import { Router } from "express";
import { fetchAllCandidates, getCandidatesInCSV } from "../controller/candidateController.js";

const candidateRouter = Router();

candidateRouter.use("/fetchAllCandidates",fetchAllCandidates)
candidateRouter.use("/getCandidateInCSV",getCandidatesInCSV)

export default candidateRouter;