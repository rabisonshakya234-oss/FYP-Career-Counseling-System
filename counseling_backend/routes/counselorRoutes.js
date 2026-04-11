var express = require("express");
const { validateTokenMiddleware } = require("../middleware/AuthMiddleware");
const { counselorOnlyMiddleware } = require("../middleware/RoleMiddleware");
const { viewAttemptHistoryController, addCounselorFeedbackController, viewAllSubmissionsController, createQuestionSetController, saveFeedbackController } = require("../controller/counselorController");

var router = express.Router();


router.post("/questionset/create", validateTokenMiddleware, counselorOnlyMiddleware, createQuestionSetController);

// router.get("/:questionSetId/correctanswers", validateTokenMiddleware, viewCorrectAnswersController)
// router.get("/attempt-history", validateTokenMiddleware, counselorOnlyMiddleware, viewAttemptHistoryController);

router.put("/feedback/:answerId", validateTokenMiddleware, addCounselorFeedbackController);

router.get("/submissions", validateTokenMiddleware, viewAllSubmissionsController);
router.post("/feedback/:attemptId", validateTokenMiddleware, saveFeedbackController);   

module.exports = router;