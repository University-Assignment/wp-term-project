const mongoose = require("mongoose");
const { MONGO_URL } = require("../env");

function connect() {
  return mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
  });
}

const { connection } = mongoose;

connection.on("error", (err) => console.error("MongoDB 연결 에러"));
connection.on("open", () => console.log("MongoDB 연결 성공"));
connection.on("disconnected", () => {
  console.error("MongoDB와의 연결이 끊겼습니다. 연결을 재시도 합니다.");
  connect();
});

const models = {};

models.User = require("./user.model");
models.Post = require("./post.model");
models.Good = require("./good.model");

module.exports = { connect, mongoose, models };
