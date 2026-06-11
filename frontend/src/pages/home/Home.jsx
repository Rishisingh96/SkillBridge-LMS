import React, { lazy, Suspense } from "react";
import SEO from "../../components/seo/SEO";
import { websiteSchema, organizationSchema } from "../../components/seo/SchemaData";

// Critical above-fold section - load immediately
import HeroSection from "../../components/home/sections/HeroSection";

// Lazy load below-fold sections for faster initial render
const TrustedCompanies = lazy(
  () => import("../../components/home/sections/TrustedCompanies"),
);
const WhyChooseUs = lazy(
  () => import("../../components/home/sections/WhyChooseUs"),
);
const CourseCategories = lazy(
  () => import("../../components/home/sections/CourseCategories"),
);
const FeaturedCourses = lazy(
  () => import("../../components/home/sections/FeaturedCourses"),
);
const LearningPaths = lazy(
  () => import("../../components/home/sections/LearningPaths"),
);
const LiveClasses = lazy(
  () => import("../../components/home/sections/LiveClasses"),
);
const Instructors = lazy(
  () => import("../../components/home/sections/Instructors"),
);
const DashboardPreview = lazy(
  () => import("../../components/home/sections/DashboardPreview"),
);
const VideoTestimonials = lazy(
  () => import("../../components/home/sections/VideoTestimonials"),
);
const SuccessStories = lazy(
  () => import("../../components/home/sections/SuccessStories"),
);
const Reviews = lazy(() => import("../../components/home/sections/Reviews"));
const AboutSection = lazy(
  () => import("../../components/home/sections/AboutSection"),
);
const FAQ = lazy(() => import("../../components/home/sections/FAQ"));
const CTABanner = lazy(
  () => import("../../components/home/sections/CTABanner"),
);
const Footer = lazy(() => import("../../components/home/shared/Footer"));

const Home = () => {
  return (
    <>
      <SEO
        title="SkillBridge LMS - Master New Skills Online"
        description="Learn from industry experts with SkillBridge LMS. Access high-quality courses, track your progress, and earn certificates. Start your learning journey today."
        keywords="online learning, LMS, courses, education, skill development, e-learning, online courses"
        schema={websiteSchema(import.meta.env.VITE_SERVER_URL || 'https://skillbridge-lms.com')}
      />
       <HeroSection />
        <Suspense fallback={null}>
        <TrustedCompanies />
        <WhyChooseUs />
        <CourseCategories />
        <FeaturedCourses />
        {/* <LearningPaths /> */}
        <LiveClasses />
        <Instructors />
        <DashboardPreview />
        <VideoTestimonials />
        <SuccessStories />
        <Reviews />
        <AboutSection />
        <FAQ />
        {/* <CTABanner /> */}
        <Footer />
      </Suspense>
    </>
  );
};

export default Home;
