require("dotenv").config();

module.exports = {
  IS_DEV: process.env.NODE_ENV === "development",
  ...process.env,
};
