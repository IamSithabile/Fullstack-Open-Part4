const dummy = (blogs) => {
  return 1;
};

const listWithOneBlog = [
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
];

const totalLikes = (blogs) => {
  const likesArray = blogs.map((blog) => blog.likes);

  const likes = likesArray.reduce((acc, cur) => {
    return acc + cur;
  }, 0);

  return likes;
};

totalLikes(listWithOneBlog);

module.exports = {
  dummy,
  totalLikes,
};
