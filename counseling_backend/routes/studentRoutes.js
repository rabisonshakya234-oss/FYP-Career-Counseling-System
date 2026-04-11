const express = require('express');
const { validateTokenMiddleware } = require("../middleware/AuthMiddleware");
const {viewAttemptHistoryController } = require('../controller/studentController');


const router = express.Router();

// Correctly protected student route
router.get(
    "/attempt-history",
    validateTokenMiddleware,
    viewAttemptHistoryController,
);

module.exports = router;
