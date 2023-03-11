const router = require("express").Router();
const Invite = require("../models/Invite.model");
const User = require("../models/User.model");
const Chat = require("../models/Chat.model");

router.post("/invites", async (req, res) => {
  try {
    const {
      sender: { sender, recipient }
    } = req.body;
    const invite = new Invite({ sender, recipient });
    const newInvite = await invite.save();

    await Promise.all([
      User.findByIdAndUpdate(recipient, {
        $push: { invitesReceived: newInvite._id }
      }),
      User.findByIdAndUpdate(sender, {
        $push: { invitesSent: newInvite._id }
      })
    ]);

    res.status(200).json(newInvite);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.get(
  "/invites/:userId/invitesReceived",

  async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId).populate({
        path: "invitesReceived",
        populate: {
          path: "sender"
        }
      });
      res.status(200).json(user.invitesReceived);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
);

router.get(
  "/invites/:userId/invitesSent",

  async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId).populate("invitesSent");
      res.status(200).json(user.invitesSent);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
);

router.put("/invites/:inviteId/accept", async (req, res) => {
  const { inviteId } = req.params;

  try {
    const invite = await Invite.findByIdAndUpdate(
      inviteId,
      {
        $set: { status: "accepted" }
      },
      { new: true }
    );

    const chat = new Chat({
      users: [invite.sender, invite.recipient]
    });
    const newChat = await chat.save();

    await Promise.all([
      User.findByIdAndUpdate(invite.recipient, {
        $push: { friends: invite.sender }
      }),
      User.findByIdAndUpdate(invite.sender, {
        $push: { friends: invite.recipient }
      }),
      User.findByIdAndUpdate(invite.recipient, {
        $push: { chats: newChat._id }
      }),
      User.findByIdAndUpdate(invite.sender, {
        $push: { chats: newChat._id }
      }),
      User.findByIdAndUpdate(invite.recipient, {
        $pull: { invitesReceived: inviteId }
      })
    ]);

    res.status(200).json(invite);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.put("/invites/:inviteId/reject", async (req, res) => {
  try {
    const { inviteId } = req.params;
    const invite = await Invite.findByIdAndUpdate(inviteId, {
      $set: { status: "rejected" }
    });
    if (!invite) {
      return res.status(404).send({ message: "Invite not found" });
    }
    await User.findByIdAndUpdate(invite.recipient, {
      $pull: { invitesReceived: inviteId }
    });
    res.status(200).json(invite);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
