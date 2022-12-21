const blogRouter = require("express").Router();
require("express-async-errors");
const jwt = require("jsonwebtoken");

const Blog = require("../models/blog");
const User = require("../models/user");
const { info, error } = require("../utils/logger");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1 });

  info("Here are the blogs:", blogs);
  response.status(200).json(blogs);
});

blogRouter.post("/", async (request, response) => {
  const { title, url, likes, author } = request.body;

  if (!title || !url) {
    console.log("No title");
    return response.status(400).json({ error: "Title or Url unspecified" });
  }

  const getTokenFrom = (request) => {
    const authorization = request.get("authorization");
    if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
      return authorization.substring(7);
    }
    return null;
  };

  const token = getTokenFrom(request);

  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title,
    url,
    user: user._id,
    author,
    likes: likes ? likes : 0,
  });

  console.log("blog :", blog);

  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog._id);

  const savedUser = await user.save();

  response.status(201).json(savedBlog);
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
