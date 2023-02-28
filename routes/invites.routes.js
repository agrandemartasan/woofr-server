const router = require("express").Router();
const Invite = require("../models/Invite.model");
const User = require("../models/User.model");

router.post("/invites", async (req, res) => {
  try {
    const { sender, recipient } = req.body;
    const invite = new Invite({ sender, recipient });
    const newInvite = await invite.save();
    await User.findByIdAndUpdate(recipient, {
      $push: { invites: newInvite._id }
    });
    res.status(200).json(newInvite);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.get("/invites/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("invites");
    res.status(200).json(user.invites);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.put("/invites/:inviteId/accept", async (req, res) => {
  const { inviteId } = req.params;

  try {
    const invite = await Invite.findByIdAndUpdate(inviteId, {
      $set: { status: "accepted" }
    });

    await Promise.all([
      User.findByIdAndUpdate(invite.recipient, {
        $push: { friends: invite.sender }
      }),
      User.findByIdAndUpdate(invite.sender, {
        $push: { friends: invite.recipient }
      }),
      User.findByIdAndUpdate(invite.recipient, { $pull: { invites: inviteId } })
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
      $pull: { invites: inviteId }
    });
    res.status(200).json(invite);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
