const { Router } = require("express");
const { requireAuthentication } = require("../middlewares/auth");
const { CLIENT_ID2, CLIENT_SECRET2 } = require("../env");
const axios = require("axios");

const router = Router();

const {
  models: { User, Post, Good },
} = require("../mongo");

router.post("/post", requireAuthentication, async (req, res, next) => {
  const { title, content } = req.body;
  const author = req.session.user.id;
  Post.create({ title, content, author }, function (err, post) {
    if (err) {
      console.log(err);
      return res.redirect("/post");
    }
    res.redirect("/board");
  });
});

router.post("/myinfo", requireAuthentication, async (req, res, next) => {
  const { name, username, password, email } = req.body;
  const exUser = await User.findOne({ username });

  if (exUser) {
    exUser.name = name;
    exUser.username = username;
    exUser.password = password;
    exUser.email = email;
    exUser.save();
    req.session.user.name = name; // 이름 갱신
    return res.redirect("/");
  }
  req.flash("errorMessage", "수정하는 도중에 문제가 발생했습니다.");
  return res.redirect("/myinfo");
});

router.get("/good/:id", requireAuthentication, async (req, res, next) => {
  const good = await Good.findOne({
    accId: req.session.user.id,
    postId: req.params.id,
  });

  const post = await Post.findOne({ _id: req.params.id });

  if (post.author == req.session.user.id) {
    req.flash("errorMessage", "본인은 좋아요를 누를 수 없습니다.");
  } else if (good) {
    await good.remove();
  } else {
    await Good.create({ accId: req.session.user.id, postId: req.params.id });
  }

  return res.redirect("/post/" + req.params.id);
});

function getDate(date) {
  let year = date.getFullYear();
  let month = new String(date.getMonth() + 1);
  let day = new String(date.getDate());
  if (month.length == 1) {
    month = "0" + month;
  }
  if (day.length == 1) {
    day = "0" + day;
  }
  return year + "-" + month + "-" + day;
}

router.get("/graph", async (req, res, next) => {
  var api_url = "https://openapi.naver.com/v1/datalab/search";
  let now = new Date();
  let endDate = getDate(now);
  let startDate = now.getFullYear() + "-01-01";

  const response = await axios.post(
    api_url,
    {
      startDate: startDate,
      endDate: endDate,
      timeUnit: "month",
      keywordGroups: [
        {
          groupName: "코로나",
          keywords: ["코로나"],
        },
      ],
    },
    {
      headers: {
        "X-Naver-Client-Id": CLIENT_ID2,
        "X-Naver-Client-Secret": CLIENT_SECRET2,
      },
    }
  );
  const data = response.data;
  res.json(data.results[0]);
});

module.exports = router;
