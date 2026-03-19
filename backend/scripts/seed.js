import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import connectDB, { disconnectDB } from "../config/db.js";
import Article from "../models/articleModel.js";
import Comment from "../models/commentModel.js";
import User from "../models/userModel.js";

dotenv.config();

const featuredImages = {
  Technology:
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80",
  Business:
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1400&q=80",
  Culture:
    "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1400&q=80",
  Opinion:
    "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1400&q=80"
};

const seed = async () => {
  try {
    await connectDB();

    await Comment.deleteMany();
    await Article.deleteMany();
    await User.deleteMany();

    const password = await bcrypt.hash("Password123!", 10);

    const users = await User.insertMany([
      {
        name: "Maya Trent",
        email: "maya@chronicle.com",
        password,
        bio: "Editor covering technology, creator economy shifts, and internet culture."
      },
      {
        name: "Jonah Price",
        email: "jonah@chronicle.com",
        password,
        bio: "Business desk contributor focused on startups, work, and financial resilience."
      },
      {
        name: "Elena Ward",
        email: "elena@chronicle.com",
        password,
        bio: "Culture writer tracking media behavior, social rituals, and audience trends."
      }
    ]);

    const articles = await Article.insertMany([
      {
        category: "Technology",
        title: "Inside the pressure reshaping independent tech careers",
        excerpt:
          "Freelancers and solo founders are rebuilding their playbooks as project pipelines narrow and client expectations climb.",
        description:
          "Independent tech workers are adapting to a market that now demands deeper specialization, quicker delivery, and broader business fluency all at once. What once looked like flexibility increasingly feels like a constant negotiation between speed, quality, and financial stability.\n\nWriters, designers, and developers are responding by narrowing their focus, building smaller product ecosystems, and leaning more heavily on audience trust. The result is a new kind of digital career: less glamorous, more deliberate, and often more resilient.",
        featuredImage: featuredImages.Technology,
        author: users[0]._id
      },
      {
        category: "Business",
        title: "Why small media teams are building products before they hire",
        excerpt:
          "Lean editorial teams are turning to templates, memberships, and workflows that generate revenue before expansion.",
        description:
          "Small media operations are acting more like product studios. Before bringing on additional writers, many are launching newsletters, paid briefings, and narrowly targeted digital products that support a more sustainable business model.\n\nThe strategy reflects a growing pressure to prove revenue discipline early. In practice, that means experimentation with subscriptions, sponsored research, and premium member experiences long before a newsroom reaches traditional scale.",
        featuredImage: featuredImages.Business,
        author: users[1]._id
      },
      {
        category: "Culture",
        title: "The new ritual of reading headlines through community commentary",
        excerpt:
          "For many readers, the story no longer ends with the article. It begins again in the discussion beneath it.",
        description:
          "Audience behavior around news is shifting from passive reading to layered participation. Readers increasingly expect context, reaction, and second-order interpretation alongside the original reporting.\n\nThat shift has consequences for how publications design trust. Moderation, ranking systems, and thoughtful commentary spaces are now part of the editorial product itself, not just a feature bolted on after publication.",
        featuredImage: featuredImages.Culture,
        author: users[2]._id
      },
      {
        category: "Opinion",
        title: "A modern publication should feel alive between editions",
        excerpt:
          "The strongest digital publications no longer publish in isolated drops. They evolve in public, in conversation with readers.",
        description:
          "A modern publication should not feel like a static archive. It should feel active, responsive, and shaped by the same audience it serves.\n\nThat does not mean abandoning editorial judgment. It means extending it into the full publishing loop: how stories are framed, how readers respond, and how the most useful commentary is elevated into the public record.",
        featuredImage: featuredImages.Opinion,
        author: users[0]._id
      }
    ]);

    await Comment.insertMany([
      {
        articleId: articles[0]._id,
        text:
          "This tracks with what I keep hearing from independent developers. Generalists are still valuable, but only when the market already trusts their judgment.",
        author: users[1]._id,
        likes: 4
      },
      {
        articleId: articles[1]._id,
        text:
          "The key shift is sequencing. Teams that treat products like proof of audience demand can hire more intentionally later.",
        author: users[2]._id,
        likes: 3
      },
      {
        articleId: articles[2]._id,
        text:
          "Commentary design is editorial design now. The ranking system shapes the reader's understanding as much as the article itself.",
        author: users[0]._id,
        likes: 5
      }
    ]);

    console.log("Seed data created successfully.");
    console.log("Demo login: maya@chronicle.com / Password123!");
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await disconnectDB();
  }
};

seed();
