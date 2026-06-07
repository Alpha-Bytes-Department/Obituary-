const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

router.get("/", authMiddleware, profileController.getProfile);
router.put("/", authMiddleware, profileController.updateProfile);
router.post(
  "/photo",
  authMiddleware,
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "funeralHomePhoto", maxCount: 1 },
  ]),
  profileController.uploadProfilePhoto,
);
router.post("/apply-token", authMiddleware, profileController.applyToken);
router.post("/approve-token/:userId", authMiddleware, profileController.approveToken);

module.exports = router;
