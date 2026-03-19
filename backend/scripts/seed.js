import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import connectDB, { disconnectDB } from "../config/db.js";
import Article from "../models/articleModel.js";
import Comment from "../models/commentModel.js";
import User from "../models/userModel.js";

dotenv.config();

const featuredImages = {
  World:
    "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1400&q=80",
  Technology:
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80",
  Finance:
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1400&q=80",
  Sports:
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1400&q=80",
  Entertainment:
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1400&q=80",
  Science:
    "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&w=1400&q=80"
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
        bio: "Senior world editor tracking geopolitical shifts, diplomacy, and fast-moving international stories."
      },
      {
        name: "Jonah Price",
        email: "jonah@chronicle.com",
        password,
        bio: "Markets and finance correspondent focused on central banks, growth signals, and investor pressure."
      },
      {
        name: "Elena Ward",
        email: "elena@chronicle.com",
        password,
        bio: "Culture and entertainment journalist covering media, audience behavior, and the global spotlight."
      }
    ]);

    const articles = await Article.insertMany([
      {
        category: "World",
        title: "Diplomatic pressure grows as leaders race to contain the next trade shock",
        excerpt:
          "Officials are scrambling to stabilize supply expectations as new tariff threats ripple across global alliances.",
        description:
          "Governments are entering a fresh round of negotiations as fears of a new trade shock spread through manufacturing, shipping, and commodity markets. Diplomats say the speed of response matters as much as the policy itself, with businesses already adjusting forward guidance in anticipation of disruption.\n\nThe result is an unusually tense period in which foreign policy, industry planning, and market confidence are moving together. Analysts say the coming week could determine whether the dispute hardens into a broader structural shift.",
        featuredImage: featuredImages.World,
        author: users[0]._id,
        status: "published"
      },
      {
        category: "Technology",
        title: "AI productivity tools are reshaping office work faster than managers expected",
        excerpt:
          "Businesses are seeing immediate workflow gains, but they are also confronting new questions around trust, review, and role design.",
        description:
          "Companies deploying generative tooling at scale are finding that the real transformation is not speed alone. It is the redesign of how teams draft, review, escalate, and approve work across departments.\n\nThat shift is forcing leaders to rethink training, accountability, and what high-quality output looks like when first drafts arrive almost instantly. The next phase of adoption may be less about novelty and more about governance.",
        featuredImage: featuredImages.Technology,
        author: users[0]._id,
        status: "published"
      },
      {
        category: "Finance",
        title: "Markets enter the week braced for another test of rate-cut optimism",
        excerpt:
          "Traders are watching inflation signals, bond moves, and central bank language for clues about how long the current calm can last.",
        description:
          "Investors are recalibrating after a stretch of strong expectations around rate cuts met a fresh wave of mixed economic data. The immediate question is whether policymakers will prioritize resilience in growth or caution on inflation.\n\nPortfolio managers say the mood is not panic but tension. Equity strength remains, yet the durability of that confidence depends on how quickly inflation, wages, and credit conditions align with the narrative markets want to believe.",
        featuredImage: featuredImages.Finance,
        author: users[1]._id,
        status: "published"
      },
      {
        category: "Sports",
        title: "A relentless fixture list is changing how elite teams manage risk and recovery",
        excerpt:
          "Clubs are rotating stars more aggressively as sports science teams warn that fatigue is reshaping outcomes as much as tactics.",
        description:
          "Across major leagues, coaches and high-performance staff are recalculating what availability really means in a packed calendar. Recovery windows are shrinking, travel intensity is climbing, and marginal decisions around substitutions now carry season-level consequences.\n\nSupporters may still focus on lineups and scores, but inside elite programs the conversation is increasingly about load, rhythm, and sustainability. That strategic layer is becoming one of the defining stories of modern sport.",
        featuredImage: featuredImages.Sports,
        author: users[1]._id,
        status: "published"
      },
      {
        category: "Entertainment",
        title: "Studios are chasing fewer blockbusters and more durable audience loyalty",
        excerpt:
          "Executives are prioritizing franchises, creator identity, and sustained engagement over one-weekend noise.",
        description:
          "Film and streaming executives are adjusting to an audience environment where novelty travels fast but loyalty is harder to sustain. The current strategy is less about releasing more titles and more about extending attention around fewer, better-positioned releases.\n\nThat has pushed marketing, talent, and platform strategy into tighter alignment. In an era of split attention, the most valuable entertainment property may be the one that can remain culturally visible for months instead of days.",
        featuredImage: featuredImages.Entertainment,
        author: users[2]._id,
        status: "published"
      },
      {
        category: "Science",
        title: "New climate modeling tools are sharpening how cities plan for extreme heat",
        excerpt:
          "Urban planners are using more precise forecasts to rethink infrastructure, public health response, and long-term resilience.",
        description:
          "Researchers are delivering more localized climate models that give city officials a clearer view of when and where heat stress will hit hardest. That granularity is beginning to influence transit planning, cooling strategy, emergency response, and building policy.\n\nScientists say the power of the new modeling lies in its practicality. Rather than broad warnings alone, officials can now plan with the kind of operational detail that turns climate insight into actionable urban policy.",
        featuredImage: featuredImages.Science,
        author: users[2]._id,
        status: "published"
      }
    ]);

    await Comment.insertMany([
      {
        articleId: articles[0]._id,
        text:
          "The part investors will care about most is not the announcement itself but how quickly logistics forecasts start changing underneath it.",
        author: users[1]._id,
        likes: 6
      },
      {
        articleId: articles[2]._id,
        text:
          "This feels like one of those moments where bond markets are telling a more cautious story than equities want to admit.",
        author: users[0]._id,
        likes: 4
      },
      {
        articleId: articles[3]._id,
        text:
          "Fixture congestion is now part of the competitive landscape, not just an excuse after the match.",
        author: users[2]._id,
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
