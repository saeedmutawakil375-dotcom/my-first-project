import Article from "../models/articleModel.js";
import Comment from "../models/commentModel.js";
import mongoose from "mongoose";

const slugify = (value = "") =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[-\s]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "story";

const generateUniqueSlug = async (title, excludeId) => {
  const baseSlug = slugify(title);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existingArticle = await Article.findOne({
      slug,
      ...(excludeId ? { _id: { $ne: excludeId } } : {})
    }).select("_id");

    if (!existingArticle) {
      return slug;
    }

    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }
};

const ensureArticleSlug = async (article) => {
  if (article.slug) {
    return article;
  }

  article.slug = await generateUniqueSlug(article.title, article._id);
  await article.save();
  return article;
};

const findArticleBySlugOrId = async (slugOrId) => {
  const articleBySlug = await Article.findOne({ slug: slugOrId });

  if (articleBySlug) {
    return articleBySlug;
  }

  if (mongoose.isValidObjectId(slugOrId)) {
    return Article.findById(slugOrId);
  }

  return null;
};

const createArticle = async (req, res) => {
  try {
    const { category, title, excerpt, description, featuredImage, youtubeUrl, status } = req.body;

    if (!category || !title || !excerpt || !description || !featuredImage) {
      return res.status(400).json({
        message: "Category, headline, excerpt, article body, and featured image are required"
      });
    }

    const article = await Article.create({
      category,
      title,
      slug: await generateUniqueSlug(title),
      excerpt,
      description,
      featuredImage,
      youtubeUrl: youtubeUrl?.trim() || "",
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
    const { category, title, excerpt, description, featuredImage, youtubeUrl, status } = req.body;

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
    article.slug = await generateUniqueSlug(title, article._id);
    article.excerpt = excerpt;
    article.description = description;
    article.featuredImage = featuredImage;
    article.youtubeUrl = youtubeUrl?.trim() || "";
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

    await Promise.all(articles.map((article) => ensureArticleSlug(article)));

    return res.status(200).json(articles);
  } catch (error) {
    return res.status(500).json({ message: "Server error while fetching articles" });
  }
};

const getArticleById = async (req, res) => {
  try {
    const article = await findArticleBySlugOrId(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    await ensureArticleSlug(article);
    await article.populate("author", "name email bio");

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

    await Promise.all(articles.map((article) => ensureArticleSlug(article)));

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
