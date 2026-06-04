const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

router.get("/", authMiddleware, profileController.getProfile);
router.post(
  "/photo",
  authMiddleware,
  upload.single("image"),
  profileController.uploadProfilePhoto,
);

module.exports = router;
