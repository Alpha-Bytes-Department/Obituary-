const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/User");
const PendingRegistration = require("../models/PendingRegistration");
const PasswordResetToken = require("../models/PasswordResetToken");
const {
  createAccessToken,
  createRefreshToken,
  verifyToken,
  createOtpCode,
} = require("../utils/jwtUtils");
const { sendMail } = require("../config/mailer");

const OTP_EXPIRY_MINUTES = 10;
const RESET_TOKEN_EXPIRY_MINUTES = 15;

/**
 * Normalize an email address for lookup.
 *
 * @param {string} email
 * @returns {string}
 */
function normalizeEmail(email) {
  return String(email || "")
    .trim()
    .toLowerCase();
}

/**
 * Build access and refresh tokens for a user.
 *
 * @param {object} user
 * @returns {{ accessToken: string, refreshToken: string }}
 */
function buildTokenPair(user) {
  const payload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  return {
    accessToken: createAccessToken(payload),
    refreshToken: createRefreshToken(payload),
  };
}

/**
 * Persist a refresh token and send the token pair to the client.
 *
 * @param {import("express").Response} res
 * @param {object} user
 * @returns {Promise<void>}
 */
async function respondWithAuthTokens(res, user) {
  const tokens = buildTokenPair(user);
  user.refreshToken = tokens.refreshToken;
  await user.save();

  return res.status(200).json({
    message: "Authentication successful",
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
  });
}

/**
 * Register a user by staging the account and sending a 6-digit OTP.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!firstName || !lastName || !normalizedEmail || !password) {
      return res
        .status(400)
        .json({ message: "All registration fields are required" });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const otpCode = createOtpCode();
    const passwordHash = await bcrypt.hash(String(password), 12);
    const otpHash = await bcrypt.hash(otpCode, 10);

    await PendingRegistration.findOneAndUpdate(
      { email: normalizedEmail },
      {
        firstName: String(firstName).trim(),
        lastName: String(lastName).trim(),
        email: normalizedEmail,
        passwordHash,
        otpHash,
        otpExpiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
        attempts: 0,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    await sendMail({
      to: normalizedEmail,
      subject: "Your registration OTP",
      text: `Your OTP code is ${otpCode}. It expires in ${OTP_EXPIRY_MINUTES} minutes.`,
      html: `<p>Your OTP code is <strong>${otpCode}</strong>.</p><p>It expires in ${OTP_EXPIRY_MINUTES} minutes.</p>`,
    });

    return res.status(200).json({
      message:
        "OTP sent to email. Complete verification to finish registration.",
      email: normalizedEmail,
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Registration failed" });
  }
};

/**
 * Verify the OTP and create the user account.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
exports.verifyRegistrationOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const pendingRegistration = await PendingRegistration.findOne({
      email: normalizedEmail,
    });
    if (!pendingRegistration) {
      return res
        .status(404)
        .json({ message: "Pending registration not found" });
    }

    if (pendingRegistration.otpExpiresAt.getTime() < Date.now()) {
      await PendingRegistration.deleteOne({ _id: pendingRegistration._id });
      return res.status(400).json({ message: "OTP has expired" });
    }

    const isOtpValid = await bcrypt.compare(
      String(otp).trim(),
      pendingRegistration.otpHash,
    );
    if (!isOtpValid) {
      pendingRegistration.attempts += 1;
      await pendingRegistration.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const createdUser = await User.create({
      firstName: pendingRegistration.firstName,
      lastName: pendingRegistration.lastName,
      email: pendingRegistration.email,
      passwordHash: pendingRegistration.passwordHash,
      role: "user",
    });

    const tokens = buildTokenPair(createdUser);
    createdUser.refreshToken = tokens.refreshToken;
    await createdUser.save();
    await PendingRegistration.deleteOne({ _id: pendingRegistration._id });

    return res.status(201).json({
      message: "Registration completed",
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: createdUser._id,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        email: createdUser.email,
        role: createdUser.role,
      },
    });
  } catch (error) {
    console.error("Verify registration error:", error);
    return res.status(500).json({ message: "OTP verification failed" });
  }
};

/**
 * Authenticate an existing user and issue a new token pair.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatches = await bcrypt.compare(
      String(password),
      user.passwordHash,
    );
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return respondWithAuthTokens(res, user);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Login failed" });
  }
};

/**
 * Request a password reset token and send it by email.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    await PasswordResetToken.deleteMany({ userId: user._id });
    await PasswordResetToken.create({
      userId: user._id,
      email: normalizedEmail,
      tokenHash,
      expiresAt: new Date(Date.now() + RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000),
    });

    const frontendBaseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const resetUrl = `${frontendBaseUrl}/forgot-password/${user._id}/${rawToken}`;

    await sendMail({
      to: normalizedEmail,
      subject: "Reset your password",
      text: `Use this link to reset your password: ${resetUrl}`,
      html: `<p>Use this link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
    });

    return res
      .status(200)
      .json({ message: "Password reset link sent to email" });
  } catch (error) {
    console.error("Request password reset error:", error);
    return res
      .status(500)
      .json({ message: "Failed to request password reset" });
  }
};

/**
 * Validate a password reset token and update the user's password.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
exports.resetPassword = async (req, res) => {
  try {
    const { userId, token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!userId || !token) {
      return res.status(400).json({ message: "Reset params are required" });
    }

    if (!password || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and confirm password are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const tokenHash = crypto
      .createHash("sha256")
      .update(String(token))
      .digest("hex");
    const resetRecord = await PasswordResetToken.findOne({ userId, tokenHash });

    if (!resetRecord) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    if (resetRecord.expiresAt.getTime() < Date.now()) {
      await PasswordResetToken.deleteMany({ userId });
      return res.status(400).json({ message: "Reset token has expired" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.passwordHash = await bcrypt.hash(String(password), 12);
    user.refreshToken = undefined;
    user.passwordChangedAt = new Date();
    await user.save();
    await PasswordResetToken.deleteMany({ userId });

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Failed to reset password" });
  }
};

/**
 * Validate a refresh token and rotate both access and refresh tokens.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
exports.refreshToken = async (req, res) => {
  try {
    const incomingToken = req.body.refreshToken || req.cookies?.refreshToken;

    if (!incomingToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    const decoded = verifyToken(
      incomingToken,
      process.env.JWT_REFRESH_SECRET || "dev_refresh_secret",
    );
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== incomingToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const tokens = buildTokenPair(user);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return res.status(200).json({
      message: "Token refreshed successfully",
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res
      .status(401)
      .json({ message: "Refresh token expired or invalid" });
  }
};

exports.test= async (req,res)=>{
  return res.status(200).json({message:"Auth route is working"})
}