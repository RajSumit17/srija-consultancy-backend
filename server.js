import express from "express";
import { config } from "dotenv";
import { loginRouter } from "./router/loginRouter.js";
import { signUpRouter } from "./router/signUpRouter.js";
import cors from "cors";
import jobRouter from "./router/jobRouter.js";
import candidateRouter from "./router/candidateRouter.js";
import router from "./router/notifyRouter.js";
import recruiterRouter from "./router/recruiterRouter.js";
import googleAuthRoutes from "./router/googleAuth.js";
// import insertData from "./dummyDataInsertion.js";
config();
// insertData(); 

const App = express();
const port = process.env.PORT || 5000;

// App.use(cors())
const allowedOrigins = [
  "https://srija-consultancy.netlify.app",
  "https://srijaconsultancy.in"
];

App.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
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
// App.get("/",(req,res)=>{
//     res.send({
//         "message":"Backend Working"
//     })
// })
App.use("/",googleAuthRoutes)
App.listen(port,()=>{
    console.log(`App listening on port ${port}`);
})