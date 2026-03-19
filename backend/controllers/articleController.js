import Article from "../models/articleModel.js";
import Comment from "../models/commentModel.js";

const createArticle = async (req, res) => {
  try {
    const { category, title, excerpt, description, featuredImage, status } = req.body;

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
      status: status === "published" ? "published" : "draft",
      author: req.user._id
    });

    const populatedArticle = await article.populate("author", "name email bio");

    return res.status(201).json(populatedArticle);
  } catch (error) {
    return res.status(500).json({ message: "Server error while creating article" });
  }
};

const updateArticle = async (req, res) => {
  try {
    const { category, title, excerpt, description, featuredImage, status } = req.body;

    if (!category || !title || !excerpt || !description || !featuredImage) {
      return res.status(400).json({
        message: "Category, headline, excerpt, article body, and featured image are required"
      });
    }

    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    if (article.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only edit your own articles" });
    }

    article.category = category;
    article.title = title;
    article.excerpt = excerpt;
    article.description = description;
    article.featuredImage = featuredImage;
    article.status = status === "published" ? "published" : "draft";

    await article.save();

    const populatedArticle = await Article.findById(article._id).populate(
      "author",
      "name email bio"
    );

    return res.status(200).json(populatedArticle);
  } catch (error) {
    return res.status(500).json({ message: "Server error while updating article" });
  }
};

const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    if (article.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own articles" });
    }

    await Comment.deleteMany({ articleId: article._id });
    await article.deleteOne();

    return res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error while deleting article" });
  }
};

const getArticles = async (req, res) => {
  try {
    const search = req.query.search?.trim();
    const category = req.query.category?.trim();
    const status = req.query.status?.trim();
    const authorId = req.query.author?.trim();
    const filter = {};

    if (category && category !== "All") {
      filter.category = category;
    }

    if (!status || status === "published") {
      filter.status = "published";
    } else if (status === "draft" && req.user) {
      filter.status = "draft";
      filter.author = req.user._id;
    } else if (req.user) {
      filter.status = status;
    }

    if (authorId) {
      filter.author = authorId;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const articles = await Article.find(filter)
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

    if (
      article.status !== "published" &&
      (!req.user || article.author._id.toString() !== req.user._id.toString())
    ) {
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

const getMyArticles = async (req, res) => {
  try {
    const search = req.query.search?.trim();
    const filter = { author: req.user._id };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const articles = await Article.find(filter)
      .populate("author", "name email bio")
      .sort({ updatedAt: -1 });

    return res.status(200).json(articles);
  } catch (error) {
    return res.status(500).json({ message: "Server error while fetching your newsroom articles" });
  }
};

export {
  createArticle,
  updateArticle,
  deleteArticle,
  getArticles,
  getArticleById,
  getMyArticles
};
