import express from "express";

const router = express.Router();

import { diagonise, getAllSymptoms } from "./diagnosis.controllers.js";

router.post("/diagnose", diagonise);
router.get("/symptoms", getAllSymptoms);

export default router;
