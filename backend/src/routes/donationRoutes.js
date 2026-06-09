const express = require("express");
const router = express.Router();
const {
  createPaymentIntent,
  confirmDonation,
} = require("../controllers/donationController");

// Step 1: Create Stripe PaymentIntent — public (no auth required)
router.post("/:memorialId/create-payment-intent", createPaymentIntent);

// Step 2: Confirm donation after Stripe payment succeeded — public
router.post("/:memorialId/confirm", confirmDonation);

module.exports = router;
