import Course from "../models/courseModel.js";
import BlogTopic from "../models/blogTopicModel.js";
import User from "../models/userModel.js";

// Generate sitemap.xml
export const generateSitemap = async (req, res) => {
  try {
    const baseUrl = process.env.CLIENT_URL || "https://skillbridge-lms.com";
    
    const staticUrls = [
      { url: "/", lastmod: new Date().toISOString(), changefreq: "daily", priority: 1.0 },
      { url: "/login", lastmod: new Date().toISOString(), changefreq: "monthly", priority: 0.8 },
      { url: "/signup", lastmod: new Date().toISOString(), changefreq: "monthly", priority: 0.8 },
      { url: "/allcourses", lastmod: new Date().toISOString(), changefreq: "daily", priority: 0.9 },
      { url: "/blogs", lastmod: new Date().toISOString(), changefreq: "daily", priority: 0.9 },
    ];

    // Get all published courses
    const courses = await Course.find({ isPublished: true })
      .select("_id updatedAt")
      .lean();

    const courseUrls = courses.map(course => ({
      url: `/course/${course._id}`,
      lastmod: course.updatedAt ? course.updatedAt.toISOString() : new Date().toISOString(),
      changefreq: "weekly",
      priority: 0.8
    }));

    // Get all published blogs
    const blogs = await BlogTopic.find({ isPublished: true })
      .populate({
        path: 'blogModel',
        populate: {
          path: 'blogCourse',
          populate: {
            path: 'blogCategory'
          }
        }
      })
      .select("slug updatedAt blogModel")
      .lean();

    const blogUrls = blogs.map(blog => {
      const categorySlug = blog.blogModel?.blogCourse?.blogCategory?.slug || 'general';
      return {
        url: `/blogs/${categorySlug}/${blog.slug}`,
        lastmod: blog.updatedAt ? blog.updatedAt.toISOString() : new Date().toISOString(),
        changefreq: "weekly",
        priority: 0.7
      };
    });

    // Get educator profiles
    const educators = await User.find({ role: "educator" })
      .select("_id updatedAt")
      .lean();

    const educatorUrls = educators.map(educator => ({
      url: `/educator/profile/${educator._id}`,
      lastmod: educator.updatedAt ? educator.updatedAt.toISOString() : new Date().toISOString(),
      changefreq: "monthly",
      priority: 0.5
    }));

    const allUrls = [...staticUrls, ...courseUrls, ...blogUrls, ...educatorUrls];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (url) => `  <url>
    <loc>${baseUrl}${url.url}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(sitemap);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    res.status(500).json({ success: false, message: "Error generating sitemap" });
  }
};

// Generate robots.txt
export const generateRobotsTxt = async (req, res) => {
  try {
    const baseUrl = process.env.CLIENT_URL || "https://skillbridge-lms.com";
    
    const robotsTxt = `User-agent: *
Allow: /

Disallow: /api/
Disallow: /admin/
Disallow: /educator/
Disallow: /student/
Disallow: /login
Disallow: /signup
Disallow: /forget-password
Disallow: /verify-email

Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay
Crawl-delay: 1`;

    res.header("Content-Type", "text/plain");
    res.send(robotsTxt);
  } catch (error) {
    console.error("Error generating robots.txt:", error);
    res.status(500).json({ success: false, message: "Error generating robots.txt" });
  }
};
