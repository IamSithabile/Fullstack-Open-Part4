const app = require("../app");
const supertest = require("supertest");
const bcrypt = require("bcrypt");

const Blog = require("../models/blog");
const User = require("../models/user");

const api = supertest(app);

const {
  initialBlogs,
  blogsInDb,
  nonExistingId,
  usersInDb,
} = require("./test_helper");

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogList = initialBlogs.map((blog) => new Blog(blog)); // This is the process the server would take to convert a normal post to one that has the format the database expects
  const promiseArray = blogList.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

describe("when getting blogs from /api/blogs, i want to test", () => {
  test("that the correct amount of blogs are returned", async () => {
    const blogsAtStart = await blogsInDb();

    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");

    const contents = await response.body.map((blog) => blog.title);

    expect(contents).toHaveLength(blogsAtStart.length);
  });

  test("that response contains the word Ways", async () => {
    const response = await api.get("/api/blogs");

    const contents = await response.body.map((blog) => blog.title);

    expect(contents).toContain("Ways to write a blog");
  });

  test("that the id is defined", async () => {
    const results = await api.get("/api/blogs");

    const contents = await results.body;

    expect(contents[0].id).toBeDefined();
  });
});

describe("When sending a post, i want to test ", () => {
  test("that a post request creates a blog in database", async () => {
    const newBlog = {
      title: "Becoming a fullstack web developer",
      author: "Shulamy Mananga",
      url: "some url",
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("content-type", /application\/json/);

    const result = await api.get("/api/blogs");

    const content = await result.body;
    expect(content.length).toBe(initialBlogs.length + 1);

    expect(content[2].id).toBeDefined();
  });

  test("that when no likes are specified it defaults to 0", async () => {
    const blog = {
      title: "Why we love blogs",
      author: "Nosizotha Mananga",
      url: "some url",
    };

    await api.post("/api/blogs").send(blog);

    const results = await api.get("/api/blogs");

    const contents = await results.body;

    expect(contents[2].likes).toBe(0);
  });

  test("that when no url or title is given server returns 400", async () => {
    const blog = { author: "jin Yen", title: "How I met your mother" };

    await api.post("/api/blogs").send(blog).expect(400);
  });
});

describe("When sending a delete request, i want to test", () => {
  test("that if id is valid, status is 204", async () => {
    const results = await api.get("/api/blogs");
    const firstBlog = await results.body[0];
    console.log(firstBlog.id);

    await api.delete(`/api/blogs/${firstBlog.id}`).expect(204);

    const result = await api.get("/api/blogs");
    const blogsRecieved = await result.body;

    expect(blogsRecieved).toHaveLength(initialBlogs.length - 1);

    const contents = blogsRecieved.map((r) => r.title);

    expect(contents).not.toContain(firstBlog.title);
  });
});

describe("When updating a blog", () => {
  test("that the updated likes property is equal 21", async () => {
    const results = await api.get("/api/blogs");
    const content = await results.body;
    const idToUpdate = content[0].id;
    console.log(idToUpdate);

    const updateLikes = { likes: 21 };

    const updatedNote = await api
      .put(`/api/blogs/${idToUpdate}`)
      .send(updateLikes)
      .expect(200);

    expect(updatedNote.body.likes).toBe(21);
  });
});

describe("When there is initially one user in db, I want to test that", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("Admin", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });
  test("that user creation succeeds with a fresh username", async () => {
    const usersAtStart = await usersInDb();

    const passwordHash = await bcrypt.hash("rapelang", 10);

    const user = {
      name: "Mpho Tlou",
      username: "Mpho",
      password: "rapelang",
    };

    const result = await api
      .post("/api/users")
      .send(user)
      .expect(201)
      .expect("content-type", /application\/json/);

    const returnedUser = await result.body;
    console.log(returnedUser);

    const usersAtEnd = await usersInDb();
    console.log(usersAtEnd);
    expect(returnedUser).not.toContain(returnedUser.passwordHash);
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);
  });

  test("that the creation fails, if the username already exists", async () => {
    const usersAtStart = await usersInDb();
    const newUser = { username: "root", name: "Superuser", password: "Tlou" };

    const results = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("content-type", /application\/json/);

    const content = await results.body;

    expect(content.error).toContain("username must be unique");

    const usersAtEnd = await usersInDb();

    expect(usersAtEnd).toEqual(usersAtStart);
  });
});

describe("When attempting to create a user account, I want to test", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const rootUser = new User({ username: "root", password: "superuser" });

    const savedUser = await rootUser.save();
    console.log("saved root user:", savedUser);
  });

  test("that creation fails when username or password is not given", async () => {
    const userWithoutPassword = { username: "TryingMyLuck" };
    const userWithoutUsername = { password: "TryingMyLuckToo" };

    const usersAtStart = await usersInDb();

    const results = await api
      .post("/api/users")
      .send(userWithoutUsername)
      .expect(401)
      .expect("content-type", /application\/json/);

    expect(results.body.error).toContain("Username or Password missing");

    const usersAtEnd = await usersInDb();

    expect(usersAtStart).toHaveLength(usersAtEnd.length);
  });

  test("that creation fails when either password or username is less than 3 characters", async () => {
    const userWithShortPassword = { username: "TryingMyLuck", password: "as" };
    const userWithShortUsername = {
      username: "as",
      password: "TryingMyLuckToo",
    };

    const usersAtStart = await usersInDb();

    const results = await api
      .post("/api/users")
      .send(userWithShortUsername)
      .expect(401)
      .expect("content-type", /application\/json/);

    expect(results.body.error).toContain("Username or Password too short");

    const usersAtEnd = await usersInDb();

    expect(usersAtStart).toHaveLength(usersAtEnd.length);
  });

  test("that creation fails when username is not unique", async () => {
    const usernameAlreadyExists = {
      username: "root",
      password: "thoughtItWasAvailable",
    };

    const usersAtStart = await usersInDb();

    const results = await api
      .post("/api/users")
      .send(usernameAlreadyExists)
      .expect(401)
      .expect("content-type", /application\/json/);

    expect(results.body.error).toContain("Username already exists");

    const usersAtEnd = await usersInDb();

    expect(usersAtStart).toHaveLength(usersAtEnd.length);
  });
});
