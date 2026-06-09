const express = require("express");
const router = express.Router();
const adminAdController = require("../controllers/adminAdController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// Public route to get ads
router.get("/", adminAdController.getAllAds);

// Protected routes (require JWT)
router.use(authMiddleware);

router.post("/", upload.single("adImage"), adminAdController.createAd);
router.put("/:id", upload.single("adImage"), adminAdController.updateAd);
router.delete("/:id", adminAdController.deleteAd);

module.exports = router;
