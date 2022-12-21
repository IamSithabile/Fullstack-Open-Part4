const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const { info, error } = require("./utils/logger");
const { MONGODB_URI } = require("./utils/config");
const blogRouter = require("./controller/blogs");
const userRouter = require("./controller/users");
const loginRouter = require("./controller/login");

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
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);

module.exports = app;
