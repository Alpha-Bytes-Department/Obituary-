const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
  
router.get('/',authController.test);
router.post("/register", authController.register);
router.post("/verify-registration", authController.verifyRegistrationOtp);
router.post("/login", authController.login);
router.post("/forgot-password", authController.requestPasswordReset);
router.post("/reset-password/:userId/:token", authController.resetPassword);
router.post("/refresh", authController.refreshToken);

module.exports = router;
