import express from "express";
import { likeComment } from "../controllers/commentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/:id/recommend", protect, likeComment);

export default router;
