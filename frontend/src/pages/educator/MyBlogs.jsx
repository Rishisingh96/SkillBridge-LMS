import React from "react";
import MyBlogsList from "../../components/shared/MyBlogsList";

const MyBlogs = () => {
  return (
    <MyBlogsList 
      role="educator" 
      backPath="/educator/profile" 
      createPath="/educator/create-blog"
      showActions={true}
    />
  );
};

export default MyBlogs;
