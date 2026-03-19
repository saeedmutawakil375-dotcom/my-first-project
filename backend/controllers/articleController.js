import Article from "../models/articleModel.js";
import Comment from "../models/commentModel.js";

const createArticle = async (req, res) => {
  try {
    const { category, title, excerpt, description, featuredImage } = req.body;

    if (!category || !title || !excerpt || !description || !featuredImage) {
      return res.status(400).json({
        message: "Category, headline, excerpt, article body, and featured image are required"
      });
    }

    const article = await Article.create({
      category,
      title,
      excerpt,
      description,
      featuredImage,
      author: req.user._id
    });

    const populatedArticle = await article.populate("author", "name email bio");

    return res.status(201).json(populatedArticle);
  } catch (error) {
    return res.status(500).json({ message: "Server error while creating article" });
  }
};

const getArticles = async (_req, res) => {
  try {
    const articles = await Article.find()
      .populate("author", "name email bio")
      .sort({ createdAt: -1 });

    return res.status(200).json(articles);
  } catch (error) {
    return res.status(500).json({ message: "Server error while fetching articles" });
  }
};

const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate("author", "name email bio");

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    const comments = await Comment.find({ articleId: article._id })
      .populate("author", "name email bio")
      .sort({ likes: -1, createdAt: -1 });

    return res.status(200).json({ article, comments });
  } catch (error) {
    return res.status(500).json({ message: "Server error while fetching article details" });
  }
};

export { createArticle, getArticles, getArticleById };
