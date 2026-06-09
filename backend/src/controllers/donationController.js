const Donation = require("../models/Donation");
const Memorial = require("../models/Memorial");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

/**
 * POST /api/donations/:memorialId/create-payment-intent
 * Creates a Stripe PaymentIntent and returns the client secret.
 * The donation record is saved after the payment is confirmed on the frontend.
 */
const createPaymentIntent = async (req, res) => {
  try {
    const { memorialId } = req.params;
    const { donorName, donorEmail, amount, message } = req.body;

    if (!donorName || !donorEmail || !amount) {
      return res.status(400).json({
        success: false,
        message: "Donor name, email, and amount are required.",
      });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 1) {
      return res.status(400).json({
        success: false,
        message: "Amount must be at least $1.",
      });
    }

    // Fetch memorial name for display
    let memorialName = "";
    try {
      const memorial = await Memorial.findById(memorialId).select("name");
      if (memorial) memorialName = memorial.name || "";
    } catch (_) {}

    // Amount in cents (Stripe requires integer cents)
    const amountInCents = Math.round(parsedAmount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      receipt_email: donorEmail,
      description: `Donation in memory of ${memorialName || "deceased"}`,
      metadata: {
        memorialId,
        memorialName,
        donorName,
        donorEmail,
        message: message || "",
      },
    });

    return res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err) {
    console.error("createPaymentIntent error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to create payment intent.",
      error: err.message,
    });
  }
};

/**
 * POST /api/donations/:memorialId/confirm
 * Called after Stripe payment succeeds on the frontend.
 * Verifies the PaymentIntent and records the donation in the database.
 */
const confirmDonation = async (req, res) => {
  try {
    const { memorialId } = req.params;
    const { paymentIntentId, donorName, donorEmail, amount, message } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ success: false, message: "paymentIntentId is required." });
    }

    // Verify with Stripe that the payment actually succeeded
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({
        success: false,
        message: `Payment not successful. Status: ${paymentIntent.status}`,
      });
    }

    // Prevent double-recording using metadata check
    const existing = await Donation.findOne({ stripePaymentIntentId: paymentIntentId });
    if (existing) {
      return res.status(200).json({ success: true, message: "Already recorded.", donation: existing });
    }

    let memorialName = paymentIntent.metadata?.memorialName || "";
    if (!memorialName) {
      try {
        const memorial = await Memorial.findById(memorialId).select("name");
        if (memorial) memorialName = memorial.name || "";
      } catch (_) {}
    }

    const amountInDollars = paymentIntent.amount / 100;

    const donation = await Donation.create({
      memorialId,
      memorialName,
      donorName: (donorName || paymentIntent.metadata?.donorName || "").trim(),
      donorEmail: (donorEmail || paymentIntent.metadata?.donorEmail || "").trim().toLowerCase(),
      amount: amountInDollars,
      message: message || paymentIntent.metadata?.message || "",
      status: "completed",
      stripePaymentIntentId: paymentIntentId,
      currency: (paymentIntent.currency || "usd").toUpperCase(),
    });

    return res.status(201).json({
      success: true,
      message: "Donation recorded. Thank you!",
      donation,
    });
  } catch (err) {
    console.error("confirmDonation error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to confirm donation.",
      error: err.message,
    });
  }
};

/**
 * GET /api/admin/donations
 * Get all donations (admin only).
 */
const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find({})
      .sort({ createdAt: -1 })
      .lean();

    const total = donations.reduce((sum, d) => sum + d.amount, 0);

    return res.status(200).json({
      success: true,
      donations,
      stats: {
        count: donations.length,
        total: parseFloat(total.toFixed(2)),
      },
    });
  } catch (err) {
    console.error("getAllDonations error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch donations.",
      error: err.message,
    });
  }
};

/**
 * DELETE /api/admin/donations/:id
 * Delete a donation record (admin only).
 */
const deleteDonation = async (req, res) => {
  try {
    await Donation.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: "Donation deleted." });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to delete donation." });
  }
};

module.exports = { createPaymentIntent, confirmDonation, getAllDonations, deleteDonation };
