const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "Ways to write a blog",
    author: "Sithabile Mananga",
    likes: 234,
    url: "some url",
  },
  {
    title: "How to NOT write a blog",
    author: "Ahlonele Mananga",
    likes: 356,
    url: "some url",
  },
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: "a blog to be deleted",
    author: "User unknown",
    url: "some url",
  });
  await blog.save();
  await blog.remove();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
};
