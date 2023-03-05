const express = require("express");
const Chat = require("../models/Chat.model");
const Message = require("../models/Message.model");

const router = express.Router();

// creating a chat when a user wants to send a message to another user for the first time
// router.post("/chats", async (req, res) => {
//   const { userId, recipientId } = req.body;
//   try {
//     let existingChat = await Chat.findOne({
//       users: { $all: [userId, recipientId] }
//     });
//     if (existingChat) {
//       return res.json(existingChat);
//     }
//     // if there's no existing chat between these two users, create a new chat
//     const newChat = await Chat.create({ users: [userId, recipientId] });
//     res.status(200).json(newChat);
//   } catch (error) {
//     res.status(500).json({ message: error });
//   }
// });

// getting all chats from specific user
router.get("/chats", async (req, res) => {
  try {
    const response = await Chat.find({ users: req.user._id })
      .populate("users", "username")
      .populate("latestMessage", "content createdAt")
      .sort({ updatedAt: -1 });
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
  const { senderId, content } = req.body;
  try {
    const response = await Message.create({
      sender: senderId,
      content,
      chat: chatId
    });
    // updating the chat's latest message
    await Chat.findByIdAndUpdate(chatId, { latestMessage: response._id });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = router;
