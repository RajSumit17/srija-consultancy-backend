import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { addNewJobPosting, deleteJobs, fetchAllJobs, getJob, getJobByCategory, getJobCategory } from "../controller/jobController.js";

const jobRouter = Router();

jobRouter.use("/add-job",addNewJobPosting);
jobRouter.use("/getAllJobs",fetchAllJobs);
jobRouter.use("/deleteJob",deleteJobs)
jobRouter.use("/getJobs",getJob)
jobRouter.use("/getJobByCategory",getJobByCategory)
jobRouter.use("/getCategory",getJobCategory)

export default jobRouter;