import { Router } from "express";
import { fetchAllCandidates } from "../controller/candidateController.js";

const candidateRouter = Router();

candidateRouter.use("/fetchAllCandidates",fetchAllCandidates)

export default candidateRouter;