import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';

const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  schema,
  noIndex = false,
  canonicalUrl
}) => {
  const location = useLocation();
  const baseUrl = import.meta.env.VITE_SERVER_URL || 'https://skillbridge-lms.com';
  
  const fullUrl = canonicalUrl || `${baseUrl}${location.pathname}`;
  const fullImageUrl = image ? (image.startsWith('http') ? image : `${baseUrl}${image}`) : `${baseUrl}/og-image.jpg`;

  const defaultTitle = 'SkillBridge LMS - Master New Skills Online';
  const defaultDescription = 'Learn from industry experts with SkillBridge LMS. Access high-quality courses, track your progress, and earn certificates. Start your learning journey today.';
  const defaultKeywords = 'online learning, LMS, courses, education, skill development, e-learning, online courses';

  const metaTitle = title || defaultTitle;
  const metaDescription = description || defaultDescription;
  const metaKeywords = keywords || defaultKeywords;

  const jsonLd = useMemo(() => {
    if (!schema) return null;
    
    return {
      '@context': 'https://schema.org',
      ...schema
    };
  }, [schema]);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:site_name" content="SkillBridge LMS" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={fullImageUrl} />
      
      {/* Additional SEO */}
      <meta name="theme-color" content="#4F46E5" />
      <meta name="msapplication-TileColor" content="#4F46E5" />
      
      {/* Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
