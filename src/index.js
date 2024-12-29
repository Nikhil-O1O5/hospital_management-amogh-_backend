import express from "express"
import dotenv from "dotenv"
import {connectDB} from "./utils/db.js"
import cors from "cors"
import doctorRoute from "./routes/doctor.route.js"
import patientRoute from "./routes/patient.route.js"

dotenv.config()

const app = express()

app.use(express.json())
// app.use(cors({
//   origin : "http://localhost:5173",
//   credentials : true
// }))

const PORT = process.env.PORT;

app.use("/api/doctor",doctorRoute);
app.use("/api/patient",patientRoute);

app.listen(PORT,()=>{
  console.log(`App is listening on PORT ${PORT}`);
  connectDB();
})