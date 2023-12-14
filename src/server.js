import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import colors from "colors";
import morgan from "morgan";
import cors from "cors";
import fileUpload from "express-fileupload";

// const color = require('color');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

//Routes files
import usersRoute from "./server/modules/auth/auth.route.js";
import doctorRoute from "./server/modules/doctor/doctor.route.js";
import diagnosisRoute from "./server/modules/diagnosis/diagnosis.route.js";
import uploadRoute from "./server/modules/upload/upload.route.js";

import {
  cleanUpDiagnosisArray,
  combineAllSymptoms,
} from "./server/utils/diagnosis.js";

const app = express();

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions)); // Use this after the variable declaration

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// initialize file upload
// app.use(fileUpload());

// Body parser
app.use(express.json());

//Run the data clean up function for disease
cleanUpDiagnosisArray();

//combine all sysptoms
combineAllSymptoms();

//Mount routers
app.use("/auth", usersRoute);
app.use("/doctor", doctorRoute);
app.use("/diagnosis", diagnosisRoute);
app.use("/upload", uploadRoute);

const PORT = process.env.PORT || 5000;

//* SERVER */
const server = app.listen(
  PORT,
  console.log(
    `server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);

  //Close the server & exit process
  server.close(() => process.exit(1));
});
