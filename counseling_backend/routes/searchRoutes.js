const express = require("express");
const router = express.Router();


const { validateTokenMiddleware } = require("../middleware/AuthMiddleware");
const { searchController } = require("../controller/searchController");

// ✅ ADDED


// GET /api/search?q=...
router.get("/", validateTokenMiddleware, searchController);

module.exports = router;