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
  const recievedBody = request.body;

  if (!recievedBody.title || !recievedBody.url) {
    console.log("No title");
    return response.status(400).json({ error: "Title or url unspecified" });
  }

  const blog = new Blog({
    ...request.body,
    likes: recievedBody.likes ? recievedBody.likes : 0,
  });

  const result = await blog.save();

  const body = await result.body;

  info("blog saved", body);

  response.status(201).json(body);
});

blogRouter.delete("/:id", async (request, response) => {
  const id = request.params.id;

  const deletedBlog = await Blog.findByIdAndRemove(id);

  if (!deletedBlog) {
    return response.status(400).end();
  }

  response.status(204).end();
});

blogRouter.put("/:id", async (request, response) => {
  const id = request.params.id;
  const body = request.body;

  const requestBody = {
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(id, requestBody, {
    new: true,
  });

  response.status(200).json(updatedBlog);
});

module.exports = blogRouter;
