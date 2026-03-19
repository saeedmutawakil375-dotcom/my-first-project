import express from "express";
import { getBreakingHeadlines } from "../controllers/headlineController.js";

const router = express.Router();

router.get("/", getBreakingHeadlines);

export default router;
