const { Router } = require("express");
const { requireAuthentication } = require("../middlewares/auth");

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

module.exports = router;
