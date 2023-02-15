const router = require("express").Router();
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

router.get("/woofr", isAuthenticated, async (req, res) => {
  try {
    const response = await User.findById(req.params.projectId);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.put("/woofr", isAuthenticated, async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      profilePicture,
      info: {
        bio,
        birthday,
        gender,
        breed,
        isNeuteredOrSpayed,
        isVaccinated,
        isTrained,
        size
      }
    } = req.body;
    const response = await User.findByIdAndUpdate(
      req.params.userId,
      {
        username,
        email,
        password,
        profilePicture,
        info: {
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
