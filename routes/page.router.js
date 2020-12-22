const { Router } = require("express");
const { requireAuthentication } = require("../middlewares/auth");
const axios = require("axios");
const { MOVIE_API_KEY, CLIENT_ID, CLIENT_SECRET } = require("../env");
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
    { $limit: 5 },
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
    { $limit: 5 },
  ]).exec();

  req.session.count = { post: posts.length, account: accounts.length };

  const response = await axios.get(
    "http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json",
    {
      params: {
        key: MOVIE_API_KEY,
        targetDt: "20201220",
      },
    }
  );
  const dailyBoxOfficeList = response.data.boxOfficeResult.dailyBoxOfficeList;

  res.render("index", {
    title: "Simple Board",
    posts,
    accounts,
    count: req.session.count,
    dailyBoxOfficeList,
    errorMessage: req.flash("errorMessage"),
  });
});

router.get("/join", (req, res, next) => {
  res.render("join", {
    title: "Simple Board",
    count: req.session.count,
    errorMessage: req.flash("errorMessage"),
  });
});

router.get("/login", (req, res, next) => {
  res.render("index", {
    title: "Simple Board",
    count: req.session.count,
    errorMessage: req.flash("errorMessage"),
  });
});

router.get("/board", async (req, res, next) => {
  let page = 1;
  if (req.query.page) {
    page = req.query.page * 1;
  }
  const limit = 7;

  var skip = (page - 1) * limit;

  let count = await Post.countDocuments();
  let maxPage = Math.ceil(count / limit);

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
    { $skip: skip },
    { $limit: limit },
    {
      $project: {
        title: 1,
        author: {
          username: 1,
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
    currentPage: page,
    maxPage: maxPage,
    count: req.session.count,
    posts,
  });
});

router.get("/newpost", requireAuthentication, (req, res, next) => {
  res.render("post-new", {
    count: req.session.count,
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
    count: req.session.count,
    errorMessage: req.flash("errorMessage"),
  });
});

router.get("/myinfo", requireAuthentication, async (req, res, next) => {
  const account = await User.findOne({ _id: req.session.user.id });
  res.render("myinfo", {
    title: "Simple Board",
    count: req.session.count,
    account,
  });
});

router.get("/movie/:name", requireAuthentication, async (req, res, next) => {
  var api_url = "https://openapi.naver.com/v1/search/movie.json";
  const response = await axios.get(api_url, {
    headers: {
      "X-Naver-Client-Id": CLIENT_ID,
      "X-Naver-Client-Secret": CLIENT_SECRET,
    },
    params: {
      query: req.params.name,
    },
  });
  const movieItem = response.data.items[0];
  movieItem.title = req.params.name;
  res.render("movie", {
    title: "Simple Board",
    count: req.session.count,
    movieItem,
  });
});

module.exports = router;
