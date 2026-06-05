import mongoose from "mongoose";
import BlogCategory from "../models/blogCategoryModel.js";
import User from "../models/userModel.js";

mongoose.connect(process.env.MONGO_URI);

const createDemoBlogs = async () => {
  try {
    // Get a user to be the creator (admin or educator)
    const creator = await User.findOne({ role: "admin" });
    
    if (!creator) {
      console.log("No admin user found. Please create an admin first.");
      process.exit(1);
    }

    const demoCategories = [
      {
        name: "Web Development",
        slug: "web-development",
        description: "Learn modern web development technologies including React, Node.js, and more. Build responsive and scalable web applications.",
        icon: "💻",
        creator: creator._id,
        isPublished: true,
      },
      {
        name: "Mobile Development",
        slug: "mobile-development",
        description: "Master mobile app development with React Native, Flutter, and native iOS/Android development. Create stunning mobile experiences.",
        icon: "📱",
        creator: creator._id,
        isPublished: true,
      },
      {
        name: "Data Science",
        slug: "data-science",
        description: "Explore data analysis, machine learning, and statistical modeling. Turn raw data into actionable insights and predictions.",
        icon: "📊",
        creator: creator._id,
        isPublished: true,
      },
      {
        name: "UI/UX Design",
        slug: "ui-ux-design",
        description: "Design beautiful and intuitive user interfaces. Learn design principles, prototyping tools, and user research methodologies.",
        icon: "🎨",
        creator: creator._id,
        isPublished: true,
      },
      {
        name: "Cloud Computing",
        slug: "cloud-computing",
        description: "Master cloud platforms like AWS, Azure, and Google Cloud. Learn deployment, scaling, and infrastructure management.",
        icon: "☁️",
        creator: creator._id,
        isPublished: true,
      },
    ];

    // Clear existing demo categories (optional - remove if you want to keep existing)
    // await BlogCategory.deleteMany({});

    const createdCategories = await BlogCategory.insertMany(demoCategories);

    console.log("✅ Demo blog categories created successfully:");
    createdCategories.forEach((category, index) => {
      console.log(`${index + 1}. ${category.name} (${category.slug})`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating demo blog categories:", error);
    process.exit(1);
  }
};

createDemoBlogs();
