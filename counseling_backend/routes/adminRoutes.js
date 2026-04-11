var express = require("express");
const { validateTokenMiddleware } = require("../middleware/AuthMiddleware");
const { adminOnlyMiddleware } = require("../middleware/RoleMiddleware");
const { getAllQuestionSetsController, getAllStudentResponsesController, getResponsesByQuestionSetController } = require("../controller/adminController");


var router = express.Router();


router.get("/question-sets", validateTokenMiddleware, getAllQuestionSetsController);
router.get("/responses", validateTokenMiddleware, getAllStudentResponsesController);
router.get("/responses/question-set/:questionSetId", validateTokenMiddleware, getResponsesByQuestionSetController);
router.get("/responses/student/:studentId", validateTokenMiddleware, getResponsesByQuestionSetController);



module.exports = router;