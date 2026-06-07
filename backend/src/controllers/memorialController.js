const Memorial = require("../models/Memorial");
const { uploadBuffer } = require("../config/cloudinary");

// Helper to safely upload a file to Cloudinary
async function uploadToCloudinary(file, folder) {
  if (!file) return null;
  const result = await uploadBuffer(file.buffer, { folder });
  return result.secure_url;
}

// ================= Create Memorial =================
exports.createMemorial = async (req, res) => {
  try {
    const userId = req.user.id;
    const body = req.body;

    // Parse JSON strings from FormData if sent stringified
    const funeralHomeDetails = typeof body.funeralHomeDetails === "string" 
      ? JSON.parse(body.funeralHomeDetails) 
      : body.funeralHomeDetails || {};

    const funeralNotice = typeof body.funeralNotice === "string" 
      ? JSON.parse(body.funeralNotice) 
      : body.funeralNotice || {};

    let funeralHomeAdvertisement = [];
    if (typeof body.funeralHomeAdvertisement === "string") {
      try {
        funeralHomeAdvertisement = JSON.parse(body.funeralHomeAdvertisement);
      } catch (e) {
        funeralHomeAdvertisement = [];
      }
    } else if (Array.isArray(body.funeralHomeAdvertisement)) {
      funeralHomeAdvertisement = body.funeralHomeAdvertisement;
    }

    // Process file uploads
    const files = req.files || {};
    
    // 1. Funeral Home Logo
    const funeralHomeLogoFile = files.funeralHomeLogo?.[0];
    let funeralHomeLogo = body.existingFuneralHomeLogo || "";
    if (funeralHomeLogoFile) {
      funeralHomeLogo = await uploadToCloudinary(funeralHomeLogoFile, "obituary/memorials/logos");
    }

    // 2. Dead Person Photos
    const deadPersonPhotoFiles = files.deadPersonPhoto || [];
    const deadPersonPhotoUrls = [];
    for (const file of deadPersonPhotoFiles) {
      const url = await uploadToCloudinary(file, "obituary/memorials/photos");
      if (url) deadPersonPhotoUrls.push(url);
    }
    // Append any existing photos passed from frontend
    let existingPhotos = [];
    if (body.existingDeadPersonPhotos) {
      existingPhotos = Array.isArray(body.existingDeadPersonPhotos) 
        ? body.existingDeadPersonPhotos 
        : JSON.parse(body.existingDeadPersonPhotos || "[]");
    }
    const finalDeadPersonPhotos = [...existingPhotos, ...deadPersonPhotoUrls].slice(0, 20);

    // 3. Family Tree Diagram
    const familyTreeDiagramFile = files.familyTreeDiagram?.[0];
    let familyTreeDiagram = body.existingFamilyTreeDiagram || "";
    if (familyTreeDiagramFile) {
      familyTreeDiagram = await uploadToCloudinary(familyTreeDiagramFile, "obituary/memorials/family-trees");
    }

    // 4. Advertisements (Max 3)
    const adFiles = files.adImage || [];
    const finalAds = [];
    
    // Merge existing ads and new ad files based on the passed ad data
    for (let i = 0; i < Math.min(funeralHomeAdvertisement.length, 3); i++) {
      const adData = funeralHomeAdvertisement[i];
      let adImage = adData.adImage || "";
      
      // If there's a new file corresponding to this ad (e.g. adImage_0)
      const adFile = files[`adImage_${i}`]?.[0];
      if (adFile) {
        adImage = await uploadToCloudinary(adFile, "obituary/memorials/ads");
      }
      
      if (adImage && adData.link) {
        finalAds.push({ adImage, link: adData.link });
      }
    }

    const memorial = new Memorial({
      name: body.name || "",
      deathDate: body.deathDate,
      birthdate: body.birthdate || Date.now(), // Fallback if not provided in UI
      location: body.location || "",
      memorialDetails: body.memorialDetails || "",
      familyDetails: body.familyDetails || "",
      lifeStory: body.lifeStory || "",
      rememberForEverQuote: body.rememberForEverQuote || "",
      favouriteQuote: body.favouriteQuote || "",
      careerSummery: body.careerSummery || "",
      funeralHomeLogo,
      deadPersonPhoto: finalDeadPersonPhotos,
      relationToDeceased: body.relationToDeceased || "",
      funeralHomeDetails,
      funeralNotice,
      funeralHomeAdvertisement: finalAds,
      familyTreeDiagram,
      country: body.country || "Unknown",
      UserId: userId,
      status: "pending",
    });

    await memorial.save();

    return res.status(201).json({ message: "Memorial submitted successfully", memorial });
  } catch (error) {
    console.error("Create memorial error:", error);
    return res.status(500).json({ message: "Failed to create memorial", error: error.message });
  }
};

// ================= Get User Memorials =================
exports.getMemorials = async (req, res) => {
  try {
    const memorials = await Memorial.find({ UserId: req.user.id }).sort({ submittedAt: -1 });
    return res.status(200).json({ memorials });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch memorials" });
  }
};

// ================= Update Memorial =================
exports.updateMemorial = async (req, res) => {
  try {
    const memorial = await Memorial.findOne({ _id: req.params.id, UserId: req.user.id });
    if (!memorial) {
      return res.status(404).json({ message: "Memorial not found" });
    }

    // E.g., appending photos
    const files = req.files || {};
    const deadPersonPhotoFiles = files.deadPersonPhoto || [];
    for (const file of deadPersonPhotoFiles) {
      if (memorial.deadPersonPhoto.length < 20) {
        const url = await uploadToCloudinary(file, "obituary/memorials/photos");
        if (url) memorial.deadPersonPhoto.push(url);
      }
    }

    // Update other fields if provided...
    // (Simplified for now as main focus is adding more photos and editing via profile)
    
    await memorial.save();
    return res.status(200).json({ message: "Memorial updated successfully", memorial });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update memorial" });
  }
};

// ================= Delete Memorial =================
exports.deleteMemorial = async (req, res) => {
  try {
    const memorial = await Memorial.findOneAndDelete({ _id: req.params.id, UserId: req.user.id });
    if (!memorial) {
      return res.status(404).json({ message: "Memorial not found" });
    }
    return res.status(200).json({ message: "Memorial deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete memorial" });
  }
};
