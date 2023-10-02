import express from "express";

const router = express.Router();

import { diagonise } from "./diagnosis.controllers.js";

router.post("/", diagonise);

export default router;
