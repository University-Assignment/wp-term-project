const { Router } = require("express");
const { requireAuthentication } = require("../middlewares/auth");
const {
  models: { User, Post },
} = require("../mongo");

const router = Router();

router.get("/", (req, res, next) => {
  res.render("index", {
    title: "Simple Board",
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

router.get("/board", requireAuthentication, async (req, res, next) => {
  console.log(await Post.find());
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
      },
    },
  ]).exec();
  console.log(posts);
  res.render("board", {
    title: "Simple Board",
    posts,
  });
});

router.get("/myinfo", requireAuthentication, (req, res, next) => {
  res.render("myinfo", {
    title: "Simple Board",
  });
});

router.get("/post", requireAuthentication, (req, res, next) => {
  res.render("post-form", {
    title: "Simple Board",
  });
});

module.exports = router;
