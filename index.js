const http = require("http");
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const { info, error } = require("./utils/logger");
const { MONGODB_URI, PORT } = require("./utils/config");

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Blog = mongoose.model("Blog", blogSchema);

const mongoUrl = MONGODB_URI;
mongoose.connect(mongoUrl).then((result) => {
  if (result) {
    info("Connected to database");
  } else {
    error("Error connectiong to database");
  }
});

app.use(cors());
app.use(express.json());

app.get("/api/blogs", (request, response) => {
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

app.post("/api/blogs", (request, response) => {
  const blog = new Blog(request.body);

  blog.save().then((result) => {
    info("blog saved", result);
    response.status(201).json(result);
  });
});

app.listen(PORT, () => {
  info(`Server running on port ${PORT}`);
});
