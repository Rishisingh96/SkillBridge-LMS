// Schema.org structured data helpers for LMS

export const organizationSchema = {
  '@type': 'Organization',
  name: 'SkillBridge LMS',
  url: 'https://skillbridge-lms.com',
  logo: 'https://skillbridge-lms.com/logo.png',
  description: 'SkillBridge LMS is a comprehensive online learning platform offering high-quality courses across various domains.',
  sameAs: [
    'https://www.facebook.com/skillbridge',
    'https://www.twitter.com/skillbridge',
    'https://www.linkedin.com/company/skillbridge'
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-234-567-8900',
    contactType: 'customer service',
    availableLanguage: 'English'
  }
};

export const websiteSchema = (url) => ({
  '@type': 'WebSite',
  name: 'SkillBridge LMS',
  url: url,
  description: 'Learn from industry experts with SkillBridge LMS. Access high-quality courses, track your progress, and earn certificates.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${url}/search?q={search_term_string}`
    },
    'query-input': 'required name=search_term_string'
  }
});

export const courseSchema = (course) => ({
  '@type': 'Course',
  name: course.title,
  description: course.description,
  provider: {
    '@type': 'Organization',
    name: 'SkillBridge LMS',
    url: 'https://skillbridge-lms.com'
  },
  courseCode: course._id,
  offers: {
    '@type': 'Offer',
    category: 'Paid',
    priceCurrency: 'USD',
    price: course.price.toString()
  },
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: 'online',
    instructor: {
      '@type': 'Person',
      name: course.creator?.name || 'Expert Instructor'
    }
  },
  aggregateRating: course.rating ? {
    '@type': 'AggregateRating',
    ratingValue: course.rating.toString(),
    reviewCount: course.reviewsCount?.toString() || '0'
  } : undefined
});

export const blogPostSchema = (blog) => ({
  '@type': 'BlogPosting',
  headline: blog.title,
  description: blog.description || blog.excerpt,
  image: blog.thumbnail,
  author: {
    '@type': 'Person',
    name: blog.author?.name || 'SkillBridge Team'
  },
  datePublished: blog.createdAt,
  dateModified: blog.updatedAt,
  publisher: {
    '@type': 'Organization',
    name: 'SkillBridge LMS',
    logo: {
      '@type': 'ImageObject',
      url: 'https://skillbridge-lms.com/logo.png'
    }
  }
});

export const breadcrumbSchema = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url
  }))
});

export const personSchema = (user) => ({
  '@type': 'Person',
  name: user.name,
  jobTitle: user.role === 'educator' ? 'Course Instructor' : 'Student',
  url: `${import.meta.env.VITE_SERVER_URL}/profile/${user._id}`,
  image: user.avatar,
  worksFor: {
    '@type': 'Organization',
    name: 'SkillBridge LMS'
  }
});

export const videoObjectSchema = (lecture, course) => ({
  '@type': 'VideoObject',
  name: lecture.title,
  description: lecture.description,
  thumbnailUrl: lecture.thumbnail,
  uploadDate: lecture.createdAt,
  duration: lecture.duration ? `PT${lecture.duration}M` : undefined,
  partOfSeries: {
    '@type': 'Course',
    name: course.title
  }
});

export const faqSchema = (faqs) => ({
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer
    }
  }))
});

export const reviewSchema = (review, course) => ({
  '@type': 'Review',
  itemReviewed: {
    '@type': 'Course',
    name: course.title
  },
  reviewRating: {
    '@type': 'Rating',
    ratingValue: review.rating.toString(),
    bestRating: '5'
  },
  author: {
    '@type': 'Person',
    name: review.user?.name || 'Anonymous'
  },
  reviewBody: review.comment,
  datePublished: review.createdAt
});
