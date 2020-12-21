const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    hashedPassword: String,
    email: String,
  },
  {
    timestamps: { createdAt: "joinedAt" },
  }
);

schema.virtual("password").set(function (password) {
  this.hashedPassword = bcrypt.hashSync(password, 12);
});

schema.methods.authenticate = function (password) {
  return bcrypt.compareSync(password, this.hashedPassword);
};

module.exports = mongoose.model("account", schema);
