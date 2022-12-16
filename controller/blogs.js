const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const { info, error } = require("../utils/logger");

blogRouter.get("/api/blogs", (request, response) => {
  Blog.find({}).then((blogs) => {
    if (blogs.length === 0) {
      info("There are currently no blogs in database");
    }
    if (blogs.length > 0) {
      info("Here are the blogs:", blogs);
    }
    response.json(blogs);
  });
});

blogRouter.post("/api/blogs", (request, response) => {
  const blog = new Blog(request.body);

  blog.save().then((result) => {
    info("blog saved", result);
    response.status(201).json(result);
  });
});

module.exports = blogRouter;
