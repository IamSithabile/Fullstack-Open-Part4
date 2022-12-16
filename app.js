const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const { info, error } = require("./utils/logger");
const { MONGODB_URI, PORT } = require("./utils/config");
const blogRouter = require("./controller/blogs");

mongoose.connect(MONGODB_URI).then((result) => {
  if (result) {
    info("Connected to database");
  } else {
    error("Error connecting to database");
  }
});

app.use(cors());
app.use(express.json());

app.use("/api/blogs", blogRouter);

module.exports = app;
