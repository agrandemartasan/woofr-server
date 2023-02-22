const router = require("express").Router();
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

router.get("/woofr/:userId", async (req, res) => {
  try {
    const response = await User.findById(req.params.userId);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.get("/all", async (req, res) => {
  try {
    const response = await User.find();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.put("/woofr/:userId", async (req, res) => {
  try {
    const {
      username,
      email,
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
    const response = await User.findByIdAndUpdate(
      req.params.userId,
      {
        username,
        email,
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
    res.status(500).json({ message: error });
  }
});

module.exports = router;
