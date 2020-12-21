const { Router } = require("express");
const { requireAuthentication } = require("../middlewares/auth");

const router = Router();

const {
  models: { User, Post },
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
    return res.redirect("/myinfo");
  }
  req.flash("errorMessage", "수정하는 도중에 문제가 발생했습니다.");
  return res.redirect("/myinfo");
});

module.exports = router;
