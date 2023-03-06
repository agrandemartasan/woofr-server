const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const chatSchema = new Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message"
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = model("Chat", chatSchema);
