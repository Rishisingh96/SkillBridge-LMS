import React from "react";
import CreateBlogForm from "../../components/shared/CreateBlogForm";

const CreateBlog = () => {
  return <CreateBlogForm role="admin" redirectPath="/admin/blogs" />;
};

export default CreateBlog;
