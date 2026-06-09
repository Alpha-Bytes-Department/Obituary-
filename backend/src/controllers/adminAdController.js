const AdminAd = require("../models/AdminAd");
const { uploadBuffer } = require("../config/cloudinary");

async function uploadToCloudinary(file, folder) {
  if (!file) return null;
  const result = await uploadBuffer(file.buffer, { folder });
  return result.secure_url;
}

// ================= Get All Ads =================
exports.getAllAds = async (req, res) => {
  try {
    const ads = await AdminAd.find();
    return res.status(200).json({ ads });
  } catch (error) {
    console.error("Get ads error:", error);
    return res.status(500).json({ message: "Failed to fetch ads" });
  }
};

// ================= Create Ad =================
exports.createAd = async (req, res) => {
  try {
    const { adLinkUrl, adTitle, adDescription, placementType, isActive } = req.body;
    let adImageUrl = req.body.adImageUrl;

    if (req.file) {
      adImageUrl = await uploadToCloudinary(req.file, "obituary/admin-ads");
    }

    if (!adImageUrl) {
      return res.status(400).json({ message: "Ad image is required" });
    }

    const newAd = new AdminAd({
      adImageUrl,
      adLinkUrl,
      adTitle,
      adDescription,
      placementType,
      isActive: isActive === 'false' || isActive === false ? false : true
    });

    await newAd.save();
    return res.status(201).json({ message: "Ad created successfully", ad: newAd });
  } catch (error) {
    console.error("Create ad error:", error);
    return res.status(500).json({ message: "Failed to create ad", error: error.message });
  }
};

// ================= Update Ad =================
exports.updateAd = async (req, res) => {
  try {
    const { id } = req.params;
    const { adLinkUrl, adTitle, adDescription, placementType, isActive } = req.body;
    
    const ad = await AdminAd.findById(id);
    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }

    let adImageUrl = ad.adImageUrl;
    if (req.file) {
      adImageUrl = await uploadToCloudinary(req.file, "obituary/admin-ads");
    } else if (req.body.adImageUrl) {
        adImageUrl = req.body.adImageUrl;
    }

    ad.adImageUrl = adImageUrl;
    if (adLinkUrl !== undefined) ad.adLinkUrl = adLinkUrl;
    if (adTitle !== undefined) ad.adTitle = adTitle;
    if (adDescription !== undefined) ad.adDescription = adDescription;
    if (placementType !== undefined) ad.placementType = placementType;
    if (isActive !== undefined) ad.isActive = isActive === 'false' || isActive === false ? false : true;

    await ad.save();
    return res.status(200).json({ message: "Ad updated successfully", ad });
  } catch (error) {
    console.error("Update ad error:", error);
    return res.status(500).json({ message: "Failed to update ad" });
  }
};

// ================= Delete Ad =================
exports.deleteAd = async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await AdminAd.findByIdAndDelete(id);
    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }
    return res.status(200).json({ message: "Ad deleted successfully" });
  } catch (error) {
    console.error("Delete ad error:", error);
    return res.status(500).json({ message: "Failed to delete ad" });
  }
};
