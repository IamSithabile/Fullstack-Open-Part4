require("dotenv").config();
const http = require("http");
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Blog = mongoose.model("Blog", blogSchema);

const mongoUrl = process.env.MONGODB_URI;
mongoose.connect(mongoUrl).then((result) => {
  if (result) {
    console.log("Connected to database");
  } else {
    console.log("Error connectiong to database");
  }
});

app.use(cors());
app.use(express.json());

app.get("/api/blogs", (request, response) => {
  Blog.find({}).then((blogs) => {
    if (blogs.length === 0) {
      console.log("There are currently no blogs in database");
    }
    if (blogs.length > 0) {
      console.log("Here are the blogs:", blogs);
    }
    response.json(blogs);
  });
});

app.post("/api/blogs", (request, response) => {
  const blog = new Blog(request.body);

  blog.save().then((result) => {
    console.log("blog saved", result);
    response.status(201).json(result);
  });
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
