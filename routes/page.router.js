const { Router } = require("express");
const { requireAuthentication } = require("../middlewares/auth");
const {
  mongoose,
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

router.get("/newpost", requireAuthentication, (req, res, next) => {
  res.render("post-new", {
    title: "Simple Board",
  });
});

router.get("/post/:id", requireAuthentication, async (req, res, next) => {
  const post = await Post.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.params.id),
      },
    },
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
        content: 1,
        createdAt: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
      },
    },
  ]).exec();
  res.render("post", {
    title: "Simple Board",
    post: post[0],
  });
});

module.exports = router;
