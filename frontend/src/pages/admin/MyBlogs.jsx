import React from "react";
import MyBlogsList from "../../components/shared/MyBlogsList";

const MyBlogs = () => {
  return (
    <MyBlogsList 
      role="admin" 
      backPath="/admin/dashboard" 
      createPath="/admin/create-blog"
      showActions={false}
    />
  );
};

export default MyBlogs;
