import express from "express";
import {
  deleteComment,
  likeComment,
  updateComment
} from "../controllers/commentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/:id").put(protect, updateComment).delete(protect, deleteComment);
router.put("/:id/recommend", protect, likeComment);

export default router;
