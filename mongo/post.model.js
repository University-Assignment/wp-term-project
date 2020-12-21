var mongoose = require("mongoose");

var postSchema = mongoose.Schema({
  title: { type: String, required: [true, "Title is required!"] },
  content: { type: String, required: [true, "Body is required!"] },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "account",
    required: true,
  },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

var Post = mongoose.model("post", postSchema);
module.exports = Post;
