const express = require("express");
const User = require("../models/User.model");
const Chat = require("../models/Chat.model");
const Message = require("../models/Message.model");

const router = express.Router();

// getting all chats from specific user
router.get("/:userId/chats", async (req, res) => {
  try {
    const response = await User.findById(req.params.userId).populate({
      path: "chats",
      populate: [
        {
          path: "users"
        },
        {
          path: "latestMessage",
          populate: "sender"
        },
        {
          path: "messages",
          populate: "sender"
        }
      ]
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// get messages from a specific chat
router.get("/chats/:chatId/messages", async (req, res) => {
  const chatId = req.params.chatId;
  try {
    const response = await Message.find({ chat: chatId })
      .populate("sender", "username")
      .sort({ createdAt: 1 });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

//posting a new message in a specific chat
router.post("/chats/:chatId/messages", async (req, res) => {
  const chatId = req.params.chatId;
  const { sender, content } = req.body;

  try {
    const response = await Message.create({
      sender,
      content,
      chat: chatId
    });
    const updatedResponse = await Message.findById(response._id).populate(
      "sender"
    );
    await Chat.findByIdAndUpdate(
      chatId,
      { $push: { messages: response._id } },
      { new: true }
    );

    // updating the chat's latest message
    await Chat.findByIdAndUpdate(chatId, { latestMessage: response._id });
    res.status(200).json(updatedResponse);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = router;
