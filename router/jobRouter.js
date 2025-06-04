import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { addNewJobPosting, deleteJobs, fetchAllJobs, getJob } from "../controller/jobController.js";

const jobRouter = Router();

jobRouter.use("/add-job",addNewJobPosting);
jobRouter.use("/getAllJobs",fetchAllJobs);
jobRouter.use("/deleteJob",deleteJobs)
jobRouter.use("/getJobs",getJob)

export default jobRouter;