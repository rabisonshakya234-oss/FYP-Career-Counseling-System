const AnswerModel = require("../model/AnswerModel");
const QuestionSetModel = require("../model/QuestionSetModel");
const UserModel = require ("../model/userModel");

// Student views their attempt history
async function viewAttemptHistoryController(req, res) {
    try {
        const { id: userId } = req.user;
        const submissions = await AnswerModel.find({user: userId})
        .populate("user", "name email")
            .populate({
                path: "questionSet",
                select: "title questions",
                model: QuestionSetModel,
        })
        .select("user questionSet responses feedback submittedAt");

    res.json({
        history: submissions,
    });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch attempt history" });
    }
}

module.exports = {
viewAttemptHistoryController,
};