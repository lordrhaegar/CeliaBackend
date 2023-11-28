import express from "express";

const router = express.Router();

import { uploadfile } from "./upload.controllers.js";

router.post("/", uploadfile);

export default router;
