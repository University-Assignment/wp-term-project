var mongoose = require("mongoose");

var goodSchema = mongoose.Schema({
  accId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "account",
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "post",
    required: true,
  },
});

var Good = mongoose.model("good", goodSchema);
module.exports = Good;
