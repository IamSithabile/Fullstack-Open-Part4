const blogRouter = require("express").Router();
require("express-async-errors");
const Blog = require("../models/blog");
const { info, error } = require("../utils/logger");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});

  info("Here are the blogs:", blogs);
  response.status(200).json(blogs);
});

blogRouter.post("/", async (request, response) => {
  const blog = new Blog(request.body);

  const result = await blog.save();

  const body = await result.body;

  info("blog saved", body);

  response.status(201).json(body);
});

module.exports = blogRouter;
