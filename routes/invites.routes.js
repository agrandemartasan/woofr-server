const router = require("express").Router();
const Invite = require("../models/Invite.model");

router.post("/invites", (req, res) => {
  const { sender, recipient, message } = req.body;
  const invite = new Invite({ sender, recipient, message });
  invite.save((error, newInvite) => {
    if (error) {
      return res.status(500).send(error);
    }
    User.findByIdAndUpdate(
      sender,
      { $push: { invites: newInvite._id } },
      (error) => {
        if (error) {
          return res.status(500).send(error);
        }
        return res.status(200).json(newInvite);
      }
    );
  });
});

router.get("/invites/:userId", (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .populate("invites")
    .exec((error, user) => {
      if (error) {
        return res.status(500).send(error);
      }
      return res.status(200).json(user.invites);
    });
});

router.put("/invites/:inviteId/accept", (req, res) => {
  const { inviteId } = req.params;
  Invite.findByIdAndUpdate(
    inviteId,
    { $set: { status: "accepted" } },
    (error, invite) => {
      if (error) {
        return res.status(500).send(error);
      }
      User.findByIdAndUpdate(
        invite.recipient,
        { $pull: { invites: inviteId } },
        (error) => {
          if (error) {
            return res.status(500).send(error);
          }
          return res.status(200).json(invite);
        }
      );
    }
  );
});

router.put("/invites/:inviteId/reject", (req, res) => {
  const { inviteId } = req.params;
  Invite.findByIdAndUpdate(
    inviteId,
    { $set: { status: "rejected" } },
    (error, invite) => {
      if (error) {
        return res.status(500).send(error);
      }
      if (!invite) {
        return res.status(404).send({ message: "Invite not found" });
      }

      User.findByIdAndUpdate(
        invite.recipient,
        { $pull: { invites: inviteId } },
        (error) => {
          if (err) {
            return res.status(500).send(error);
          }
          return res.status(200).json(invite);
        }
      );
    }
  );
});
