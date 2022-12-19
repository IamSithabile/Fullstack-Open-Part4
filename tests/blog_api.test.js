const app = require("../app");
const supertest = require("supertest");

const Blog = require("../models/blog");

const api = supertest(app);

const initialBlogs = [
  { title: "Ways to write a blog", author: "Sithabile Mananga", likes: 234 },
  { title: "How to NOT write a blog", author: "Ahlonele Mananga", likes: 356 },
];

// beforeEach(async () => {
//   await Blog.deleteMany({});

//   let blog = await new Blog(initialBlogs[0]);
//   await blog.save();

//   blog = await new Blog(initialBlogs[1]);
//   await blog.save();
// });

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogList = initialBlogs.map((blog) => new Blog(blog)); // This is the process the server would take to convert a normal post to one that has the format the database expects
  const promiseArray = blogList.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

test("that correct amount of blogs are returned", async () => {
  const resultBlogs = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");

  const contents = await response.body.map((blog) => blog.title);

  expect(contents).toHaveLength(initialBlogs.length);
});

test("that response contains the word Ways", async () => {
  const response = await api.get("/api/blogs");

  const contents = await response.body.map((blog) => blog.title);

  expect(contents).toContain("Ways to write a blog");
});

test("id to be defined", async () => {
  const results = await api.get("/api/blogs");

  const contents = await results.body;

  expect(contents[0].id).toBeDefined();
});
