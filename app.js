const express = require("express");
const morgan = require("morgan");
const createError = require("http-errors");
const nunjucks = require("nunjucks");
const { join } = require("path");
const flash = require("connect-flash");
const { authenticated } = require("./middlewares/auth");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { mongoose } = require("./mongo/index");
const MongoStore = require("connect-mongo")(session);

const { IS_DEV, COOKIE_SECRET } = require("./env");
const pageRouter = require("./routes/page.router");
const authRouter = require("./routes/auth.router");
const funcRouter = require("./routes/func.router");

const app = express();

nunjucks.configure("views", {
  express: app,
  watch: true,
});
app.set("view engine", "html");

app.use(morgan(IS_DEV ? "dev" : "combined"));
app.use("/public", express.static(join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

app.use(flash());
app.use(authenticated);

app.use(pageRouter);
app.use(authRouter);
app.use(funcRouter);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.status = err.status;
  res.render("error", { title: "Simple Board - Error" });
});

module.exports = app;
