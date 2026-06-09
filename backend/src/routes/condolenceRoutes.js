const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams to access memorialId from parent router if needed
const condolenceController = require("../controllers/condolenceController");
const authMiddleware = require("../middlewares/authMiddleware");

// We might want to allow logged-in users to have their userId automatically attached
// However, non-logged in users should also be able to submit. 
// authMiddleware usually blocks if token is invalid or missing.
// So we use a custom optional auth middleware or handle it in the controller.
// We'll just define the route and let the controller handle optional user extraction if possible.
// Wait, our authMiddleware returns 401 if no token. We can create an optionalAuthMiddleware.

const optionalAuthMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const jwt = require('jsonwebtoken');
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        } catch (error) {
            // Ignore invalid token for optional auth
        }
    }
    next();
};


router.post("/:memorialId", optionalAuthMiddleware, condolenceController.createCondolence);
router.get("/:memorialId", condolenceController.getCondolences);

module.exports = router;
