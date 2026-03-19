import express from "express";
import {
  createArticle,
  deleteArticle,
  getArticleById,
  getArticles,
  getMyArticles,
  updateArticle
} from "../controllers/articleController.js";
import { addComment } from "../controllers/commentController.js";
import { optionalProtect, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(optionalProtect, getArticles).post(protect, createArticle);
router.get("/mine/list", protect, getMyArticles);
router
  .route("/:id")
  .get(optionalProtect, getArticleById)
  .put(protect, updateArticle)
  .delete(protect, deleteArticle);
router.post("/:articleId/comments", protect, addComment);

export default router;
