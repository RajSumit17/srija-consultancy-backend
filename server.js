import express from "express";
import { config } from "dotenv";
import { loginRouter } from "./router/loginRouter.js";
import { signUpRouter } from "./router/signUpRouter.js";
import cors from "cors";
import jobRouter from "./router/jobRouter.js";
import candidateRouter from "./router/candidateRouter.js";
import router from "./router/notifyRouter.js";
import recruiterRouter from "./router/recruiterRouter.js";
// import insertData from "./dummyDataInsertion.js";
config();
// insertData(); 

const App = express();
const port = process.env.PORT || 5000;

// App.use(cors())
App.use(cors({
  origin: ["https://srija-consultancy.netlify.app","http://127.0.0.1:5500"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
App.use(express.json());
App.use(express.urlencoded({ extended: true }));
App.use("/api/login/",loginRouter);
App.use("/api/signup/",signUpRouter);
App.use("/api/jobs/",jobRouter);
App.use("/api/candidate/",candidateRouter)
App.use("/api/apply",router)
App.use("/api/recruiter",recruiterRouter)
App.get("/",(req,res)=>{
    res.send({
        "message":"Backend Working"
    })
})
App.listen(port,()=>{
    console.log(`App listening on port ${port}`);
})
