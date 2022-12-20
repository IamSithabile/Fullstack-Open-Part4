const app = require("../app");
const supertest = require("supertest");

const Blog = require("../models/blog");

const api = supertest(app);

const { initialBlogs, blogsInDb, nonExistingId } = require("./test_helper");

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogList = initialBlogs.map((blog) => new Blog(blog)); // This is the process the server would take to convert a normal post to one that has the format the database expects
  const promiseArray = blogList.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

describe("when getting blogs from /api/blogs, i want to test", () => {
  test("that the correct amount of blogs are returned", async () => {
    await api
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
