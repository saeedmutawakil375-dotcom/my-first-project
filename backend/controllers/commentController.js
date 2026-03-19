import Article from "../models/articleModel.js";
import Comment from "../models/commentModel.js";

const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { articleId } = req.params;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    const comment = await Comment.create({
      articleId,
      text,
      author: req.user._id
    });

    const populatedComment = await comment.populate("author", "name email bio");

    return res.status(201).json(populatedComment);
  } catch (error) {
    return res.status(500).json({ message: "Server error while adding comment" });
  }
};

const likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const alreadyLiked = comment.likedBy.some(
      (likedUserId) => likedUserId.toString() === req.user._id.toString()
    );

    if (alreadyLiked) {
      return res.status(400).json({ message: "You have already recommended this comment" });
    }

    comment.likes += 1;
    comment.likedBy.push(req.user._id);
    await comment.save();

    const updatedComment = await Comment.findById(comment._id).populate(
      "author",
      "name email bio"
    );

    return res.status(200).json(updatedComment);
  } catch (error) {
    return res.status(500).json({ message: "Server error while recommending comment" });
  }
};

export { addComment, likeComment };
