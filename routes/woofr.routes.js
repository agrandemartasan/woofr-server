const router = require("express").Router();
const User = require("../models/User.model");
const fileUpload = require("../config/cloudinary");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const bcrypt = require("bcryptjs");

router.get("/all", async (req, res) => {
  try {
    const response = await User.find();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const response = await User.findById(req.params.userId).populate([
      "invitesSent",
      "invitesReceived",
      "friends"
    ]);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.put("/:userId", async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      profilePicture,
      locationByParish,
      bio,
      birthday,
      gender,
      breed,
      isNeuteredOrSpayed,
      isVaccinated,
      isTrained,
      size
    } = req.body;

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const response = await User.findByIdAndUpdate(
      req.params.userId,
      {
        username,
        email,
        password: hashedPassword,
        profilePicture,
        info: {
          locationByParish,
          bio,
          birthday,
          gender,
          breed,
          isNeuteredOrSpayed,
          isVaccinated,
          isTrained,
          size
        }
      },
      { new: true }
    );
    res.status(200).json(response);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: error.message });
  }
});

router.post(
  "/upload",
  fileUpload.single("filename"),
  async (req, res, next) => {
    try {
      if (req.file) {
        res.status(200).json({ fileUrl: req.file.path });
      } else {
        res.status(301).json({
          message: "An error occurred while returning the image path"
        });
      }
    } catch (error) {
      console.log("err: ", error);
      res
        .status(301)
        .json({ message: "An error occurred while returning the image path" });
    }
  }
);

// Route to get a specific user's friends
router.get("/:userId/friends", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("friends");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.friends);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

// Route to unfriend a user
router.put("/:userId/unfriend", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friendId = req.body.friendId;
    console.log(friendId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const friendIndex = user.friends.indexOf(friendId);

    if (friendIndex === -1) {
      return res.status(404).json({ message: "User is not a friend" });
    }

    await User.findByIdAndUpdate(user._id, {
      $pull: {
        friends: friendId
      }
    });
    await User.findByIdAndUpdate(friendId, {
      $pull: {
        friends: user._id
      }
    });

    res.json(user.friends);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

module.exports = router;
