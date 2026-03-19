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

const updateComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only edit your own comments" });
    }

    comment.text = text;
    await comment.save();

    const updatedComment = await Comment.findById(comment._id).populate(
      "author",
      "name email bio"
    );

    return res.status(200).json(updatedComment);
  } catch (error) {
    return res.status(500).json({ message: "Server error while updating comment" });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own comments" });
    }

    await comment.deleteOne();

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error while deleting comment" });
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

export { addComment, updateComment, deleteComment, likeComment };
