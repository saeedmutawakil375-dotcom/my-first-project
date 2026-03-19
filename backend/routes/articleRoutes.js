import express from "express";
import {
  createArticle,
  getArticleById,
  getArticles
} from "../controllers/articleController.js";
import { addComment } from "../controllers/commentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getArticles).post(protect, createArticle);
router.get("/:id", getArticleById);
router.post("/:articleId/comments", protect, addComment);

export default router;
