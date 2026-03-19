import express from "express";
import {
  createArticle,
  deleteArticle,
  getArticleById,
  getArticles,
  updateArticle
} from "../controllers/articleController.js";
import { addComment } from "../controllers/commentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getArticles).post(protect, createArticle);
router.route("/:id").get(getArticleById).put(protect, updateArticle).delete(protect, deleteArticle);
router.post("/:articleId/comments", protect, addComment);

export default router;
