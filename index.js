const http = require("http");
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const { info, error } = require("./utils/logger");
const { MONGODB_URI, PORT } = require("./utils/config");
const blogRouter = require("./controller/blogs");

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

app.use("/api/blogs", blogRouter);

app.listen(PORT, () => {
  info(`Server running on port ${PORT}`);
});
