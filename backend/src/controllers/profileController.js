const User = require("../models/User");
const FuneralHome = require("../models/FuneralHome");
const { uploadBuffer } = require("../config/cloudinary");

/**
 * Pick the first defined value from a list.
 *
 * @param {...any} values
 * @returns {any}
 */
function pick(...values) {
  return values.find(
    (value) => value !== undefined && value !== null && value !== "",
  );
}

/**
 * Build a safe address object with missing fields created on demand.
 *
 * @param {object} currentAddress
 * @param {object} incomingAddress
 * @returns {object}
 */
function mergeAddress(currentAddress = {}, incomingAddress = {}) {
  return {
    street: pick(incomingAddress.street, currentAddress.street, ""),
    city: pick(incomingAddress.city, currentAddress.city, ""),
    state: pick(incomingAddress.state, currentAddress.state, ""),
    postalCode: pick(incomingAddress.postalCode, currentAddress.postalCode, ""),
    country: pick(incomingAddress.country, currentAddress.country, ""),
  };
}

/**
 * Build funeral home fields from a request payload.
 *
 * @param {object} body
 * @returns {object}
 */
function buildFuneralHomePayload(body = {}) {
  const incomingFuneralHome = body.funeralHome || {};
  const payload = {
    name: pick(incomingFuneralHome.name, body.funeralHomeName),
    address: pick(
      incomingFuneralHome.address,
      body.funeralHomeAddressText,
      body.funeralHomeAddress,
    ),
    phone: pick(incomingFuneralHome.phone, body.funeralHomePhone),
    email: pick(incomingFuneralHome.email, body.funeralHomeEmail),
    website: pick(incomingFuneralHome.website, body.funeralHomeWebsite),
    description: pick(
      incomingFuneralHome.description,
      body.funeralHomeDescription,
    ),
    MapLink: pick(
      incomingFuneralHome.MapLink,
      body.funeralHomeMapLink,
      body.MapLink,
    ),
  };

  return payload;
}

/**
 * Remove undefined/null/empty string values from an object.
 *
 * @param {object} value
 * @returns {object}
 */
function cleanObject(value = {}) {
  return Object.fromEntries(
    Object.entries(value).filter(
      ([, entry]) => entry !== undefined && entry !== null && entry !== "",
    ),
  );
}

// ================= Get User Profile =================
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select(
      "-passwordHash -refreshToken",
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let funeralHome = null;
    funeralHome = await FuneralHome.findOne({ userId }).select("-__v");

    return res.status(200).json({
      user,
      funeralHome,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// ================ Update User Profile =================
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, address, profilePhotoUrl, funeralHome } =
      req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.firstName = pick(firstName, user.firstName);
    user.lastName = pick(lastName, user.lastName);
    user.profilePhotoUrl = pick(profilePhotoUrl, user.profilePhotoUrl);
    user.address = mergeAddress(user.address || {}, address || {});
    await user.save();

    const funeralHomePayload = buildFuneralHomePayload({
      ...req.body,
      funeralHome: funeralHome || {},
    });

    let funeralHomeRecord = await FuneralHome.findOne({ userId });
    const hasFuneralHomeInput =
      Object.keys(cleanObject(funeralHomePayload)).length > 0;

    if (hasFuneralHomeInput) {
      funeralHomeRecord = await FuneralHome.findOneAndUpdate(
        { userId },
        {
          ...cleanObject(funeralHomePayload),
          userId,
        },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      );
    }

    const updatedUser = await User.findById(userId).select(
      "-passwordHash -refreshToken",
    );

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
      funeralHome: funeralHomeRecord,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: "Failed to update profile" });
  }
};

// ================= Upload Profile Photo =================
exports.uploadProfilePhoto = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!req.files && !req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const profileFile = req.files?.profilePhoto?.[0] || req.file;
    const funeralHomeFile = req.files?.funeralHomePhoto?.[0];

    let profilePhotoUrl = user.profilePhotoUrl || null;
    let funeralHomeLogoUrl = null;

    if (profileFile) {
      const profileUpload = await uploadBuffer(profileFile.buffer, {
        folder: "obituary/profile-photos",
      });
      profilePhotoUrl = profileUpload.secure_url;
      user.profilePhotoUrl = profilePhotoUrl;
    }

    let funeralHomeRecord = null;
    if (funeralHomeFile) {
      const logoUpload = await uploadBuffer(funeralHomeFile.buffer, {
        folder: "obituary/funeral-home-logos",
      });
      funeralHomeLogoUrl = logoUpload.secure_url;

      funeralHomeRecord = await FuneralHome.findOneAndUpdate(
        { userId },
        { userId, logoImageUrl: funeralHomeLogoUrl },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      );
    }

    await user.save();

    const updatedUser = await User.findById(userId).select(
      "-passwordHash -refreshToken",
    );

    return res.status(200).json({
      message: "Profile photo uploaded successfully",
      profilePhotoUrl,
      funeralHomeLogoUrl,
      user: updatedUser,
      funeralHome: funeralHomeRecord,
    });
  } catch (error) {
    console.error("Upload profile photo error:", error);
    return res.status(500).json({ message: "Failed to upload profile photo" });
  }
};
