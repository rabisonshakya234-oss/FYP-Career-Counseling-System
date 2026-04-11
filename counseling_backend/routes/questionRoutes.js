var express = require("express");
const { validateTokenMiddleware } = require("../middleware/AuthMiddleware");
const { listQuestionSetsController, getQuestionSetController, saveAttemptedQuestionController,submitAssessementController } = require("../controller/questionController");

var router = express.Router();


router.get("/set/list", validateTokenMiddleware, listQuestionSetsController);
router.get("/set/:id", validateTokenMiddleware, getQuestionSetController);
router.post(
    "/answer/attempt",
    validateTokenMiddleware,
    saveAttemptedQuestionController
);

// Assessment submission routes
router.post("/assessment/submit", validateTokenMiddleware, submitAssessementController)



module.exports = router;