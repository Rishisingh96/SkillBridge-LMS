import React from "react";

const BlogContent = ({ topic }) => {
  if (!topic) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 dark:text-gray-400">No topic selected</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-[#0F172A] rounded-[30px] border border-gray-200 dark:border-white/10 p-8">
        
        {topic.thumbnail && (
          <img
            src={topic.thumbnail}
            alt={topic.title}
            className="w-full h-64 object-cover rounded-2xl mb-6"
          />
        )}

        <h1 className="text-4xl font-bold dark:text-white mb-4">
          {topic.title}
        </h1>

        {topic.excerpt && (
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            {topic.excerpt}
          </p>
        )}

        <div className="flex items-center gap-4 mb-6 text-sm text-gray-500 dark:text-gray-400">
          <span>👁️ {topic.views || 0} views</span>
          <span>👍 {topic.likes?.length || 0} likes</span>
          <span>💬 {topic.comments?.length || 0} comments</span>
        </div>

        {topic.tags && topic.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {topic.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="prose dark:prose-invert max-w-none">
          <div
            dangerouslySetInnerHTML={{ __html: topic.content }}
            className="text-gray-700 dark:text-gray-300 leading-relaxed"
          />
        </div>

      </div>
    </div>
  );
};

export default BlogContent;
