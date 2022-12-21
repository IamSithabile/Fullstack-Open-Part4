const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  passwordHash: String,
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});
const User = mongoose.model("User", userSchema);
module.exports = User;

// {
//       "author": "Mpho Tlou",
//       "title": "Why is procrastinatoin bad for you",
//       "url": "www.whyyoupracrastinate.com",
//       "userId":"63a1c3d75360cf8479117d5d"
//     }

// {
//     "username":"root",
//     "password":"Admin"
// }

// {
//     "username":"superRoot",
//     "password":"poweruser"
// }
