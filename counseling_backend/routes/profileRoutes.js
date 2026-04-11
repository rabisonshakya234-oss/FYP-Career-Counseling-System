const express = require("express");
const { validateTokenMiddleware } = require("../middleware/AuthMiddleware");
const { getRecentUserProfileController, updateRecentUserProfileController, getUserProfileController } = require("../controller/profileController");
const { uploadMiddleware } = require("../middleware/FileHandleMiddleware");

// Error is fixed here.....
const router = express.Router(); 

router.get(
    "/me", validateTokenMiddleware, getRecentUserProfileController
)

router.put(
    "/me", validateTokenMiddleware,
    uploadMiddleware.single("profileImage"),
    updateRecentUserProfileController
)

router.get(
    "/me", validateTokenMiddleware, getUserProfileController
)
module.exports = router;