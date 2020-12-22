const { Router } = require("express");
const { requireAuthentication } = require("../middlewares/auth");
const {
  mongoose,
  models: { User, Post, Good },
} = require("../mongo");

const router = Router();

router.get("/", async (req, res, next) => {
  const posts = await Post.aggregate([
    {
      $lookup: {
        from: "accounts",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    { $unwind: "$author" },
    {
      $lookup: {
        from: "goods",
        localField: "_id",
        foreignField: "postId",
        as: "goods",
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $project: {
        title: 1,
        author: {
          name: 1,
        },
        views: 1,
        createdAt: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        goodCount: { $size: "$goods" },
      },
    },
  ]).exec();

  const accounts = await User.aggregate([
    {
      $lookup: {
        from: "posts",
        localField: "_id",
        foreignField: "author",
        as: "posts",
      },
    },
    {
      $project: {
        name: 1,
        username: 1,
        postCount: { $size: "$posts" },
      },
    },
    { $sort: { postCount: -1 } },
  ]).exec();

  res.render("index", {
    title: "Simple Board",
    posts,
    accounts,
    errorMessage: req.flash("errorMessage"),
  });
});

router.get("/join", (req, res, next) => {
  res.render("join", {
    title: "Simple Board",
    errorMessage: req.flash("errorMessage"),
  });
});

router.get("/login", (req, res, next) => {
  res.render("index", {
    title: "Simple Board",
    errorMessage: req.flash("errorMessage"),
  });
});

router.get("/board", async (req, res, next) => {
  const posts = await Post.aggregate([
    {
      $lookup: {
        from: "accounts",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    { $unwind: "$author" },
    {
      $lookup: {
        from: "goods",
        localField: "_id",
        foreignField: "postId",
        as: "goods",
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $project: {
        title: 1,
        author: {
          name: 1,
        },
        views: 1,
        createdAt: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        goodCount: { $size: "$goods" },
      },
    },
  ]).exec();
  res.render("board", {
    title: "Simple Board",
    posts,
  });
});

router.get("/newpost", requireAuthentication, (req, res, next) => {
  res.render("post-new", {
    title: "Simple Board",
  });
});

router.get("/post/:id", requireAuthentication, async (req, res, next) => {
  const post = await Post.findOne({ _id: req.params.id });
  if (!post) res.redirect("/");
  if (post.author != req.session.user.id) {
    post.views++;
    post.save();
  }
  const user = await User.findOne({ _id: post.author });
  if (!user) res.redirect("/");
  post.name = user.name;
  post.createdAt_ = new Date(post.createdAt)
    .toISOString()
    .replace(/T/, " ")
    .replace(/\..+/, "");

  const goods = await Good.find({ postId: req.params.id });
  post.goodCount = goods.length;
  res.render("post", {
    title: "Simple Board",
    post: post,
    errorMessage: req.flash("errorMessage"),
  });
});

router.get("/myinfo", requireAuthentication, async (req, res, next) => {
  const account = await User.findOne({ _id: req.session.user.id });
  res.render("myinfo", {
    title: "Simple Board",
    account,
  });
});

module.exports = router;
