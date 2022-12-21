const userRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

userRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", { title: 1 });

  response.status(200).json(users);
});

userRouter.post("/", async (request, response) => {
  const { name, username, password, userId } = request.body;

  //   const user = await User.findById(userId);
  //   console.log(user);

  const alreadyExists = await User.findOne({ username });

  if (alreadyExists) {
    return response.status(400).json({ error: "username must be unique" });
  }

  const saltRounds = 10;

  const passwordHash = await bcrypt.hash(password, saltRounds);

  const newUser = new User({ name, username, passwordHash });

  const returnedUser = await newUser.save();

  //   user.blogs = user.blogs.concat(returnedUser._id);

  response.status(201).json(returnedUser);
});

module.exports = userRouter;
