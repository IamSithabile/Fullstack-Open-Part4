const blogRouter = require("express").Router();
require("express-async-errors");
const Blog = require("../models/blog");
const { info, error } = require("../utils/logger");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});

  response.status(200).json(blogs);

  // Blog.find({})
  //   .then((blogs) => {
  //     if (blogs.length === 0) {
  //       info("There are currently no blogs in database");
  //     }
  //     if (blogs.length > 0) {
  //       info("Here are the blogs:", blogs);
  //     }
  //     response.status(200).json(blogs);
  //   })
});

blogRouter.post("/", (request, response) => {
  const blog = new Blog(request.body);

  blog
    .save()
    .then((result) => {
      info("blog saved", result);
      response.status(201).json(result);
    })
    .catch((error) => error("There has been an error saving the blog:", error));
});

module.exports = blogRouter;
