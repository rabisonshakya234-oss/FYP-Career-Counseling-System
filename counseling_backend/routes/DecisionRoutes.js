const express = require("express");
const { validateTokenMiddleware } = require("../middleware/AuthMiddleware");
const { createDecisionController, getDecisionById, updateDecisionController } = require("../controller/decisionController");
const router = express.Router();


router.post("/decision", validateTokenMiddleware, createDecisionController);
router.get("/decision/:id", validateTokenMiddleware, getDecisionById);
router.put("/decision/:id", validateTokenMiddleware, updateDecisionController);

module.exports = router;