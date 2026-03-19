import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
      enum: ["World", "Technology", "Business", "Culture", "Opinion", "Community"]
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    excerpt: {
      type: String,
      required: true,
      trim: true,
      maxlength: 240
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    featuredImage: {
      type: String,
      required: true,
      trim: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Article = mongoose.model("Article", articleSchema);

export default Article;
