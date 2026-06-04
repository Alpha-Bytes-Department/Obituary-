const User = require("../models/User");
const FuneralHome = require("../models/FuneralHome");
const { uploadBuffer } = require("../config/cloudinary");

// ================= Get User Profile =================
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Fetching profile for user ID:", userId);
    const user = await User.findById(userId).select(
      "-passwordHash -refreshToken",
    );
    console.log("User found:", user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let funeralHome = null;
    if (user.role === "admin") {
      funeralHome = await FuneralHome.findOne({ admin: userId }).select(
        "-admin",
      );
    }

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
    const { firstName, lastName, address } = req.body;
    console.log(
      "Updating profile for user ID:",
      userId,
      "with data:",
      req.body,
    );
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.address = {
      street: address?.street || user.address.street,
      city: address?.city || user.address.city,
      state: address?.state || user.address.state,
      postalCode: address?.postalCode || user.address.postalCode,
      country: address?.country || user.address.country,
    };
    await user.save();
    console.log("Profile updated successfully for user ID:", userId);
    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: "Failed to update profile" });
  }
};

// ================= Upload Profile Photo =================
exports.uploadProfilePhoto = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const uploadResult = await uploadBuffer(req.file.buffer, {
      folder: "obituary/profile-photos",
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePhotoUrl: uploadResult.secure_url,
      },
      { new: true },
    ).select("-passwordHash -refreshToken");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Profile photo uploaded successfully",
      profilePhotoUrl: uploadResult.secure_url,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Upload profile photo error:", error);
    return res.status(500).json({ message: "Failed to upload profile photo" });
  }
};
