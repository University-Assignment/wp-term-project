exports.authenticated = (req, res, next) => {
  res.locals.isAuthenticated = req.session.isAuthenticated;
  if (req.session.isAuthenticated) {
    res.locals.user = req.session.user;
  }
  next();
};

exports.requireAuthentication = (req, res, next) => {
  if (req.session.isAuthenticated) {
    next();
  } else {
    req.flash("errorMessage", "로그인 후에 사용해주세요.");
    res.redirect("/login");
  }
};
