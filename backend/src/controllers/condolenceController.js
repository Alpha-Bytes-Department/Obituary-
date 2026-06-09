const Condolence = require("../models/Condolence");

// ================= Create Condolence =================
exports.createCondolence = async (req, res) => {
  try {
    const { memorialId } = req.params;
    const { submitterEmail, submitterName, message, type } = req.body;
    let userId = null;

    if (req.user && req.user.id) {
        userId = req.user.id;
    }

    // Check if the user/email already submitted for this memorial
    const existingCondolence = await Condolence.findOne({ memorialId, submitterEmail });
    if (existingCondolence) {
      return res.status(400).json({ message: "You have already submitted a condolence for this memorial." });
    }

    const newCondolence = new Condolence({
      memorialId,
      userId,
      submitterEmail,
      submitterName,
      message,
      type: type || 'flower'
    });

    await newCondolence.save();
    return res.status(201).json({ message: "Condolence submitted successfully", condolence: newCondolence });
  } catch (error) {
    console.error("Create condolence error:", error);
    // Handle mongoose duplicate key error explicitly
    if (error.code === 11000) {
        return res.status(400).json({ message: "You have already submitted a condolence for this memorial." });
    }
    return res.status(500).json({ message: "Failed to submit condolence", error: error.message });
  }
};

// ================= Get Condolences for a Memorial =================
exports.getCondolences = async (req, res) => {
  try {
    const { memorialId } = req.params;
    const condolences = await Condolence.find({ memorialId }).sort({ createdAt: -1 });
    return res.status(200).json({ condolences });
  } catch (error) {
    console.error("Get condolences error:", error);
    return res.status(500).json({ message: "Failed to fetch condolences" });
  }
};
