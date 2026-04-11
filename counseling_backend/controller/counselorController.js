const QuestionSet = require("../model/QuestionSetModel");
const AnswerModel = require("../model/AnswerModel");
const mongoose = require("mongoose"); // mongoose was never imported — this is the root cause of "ReferenceError: mongoose is not defined" on line 66

async function createQuestionSetController(req, res) {
    const data = req.body;
    const { id } = req.user;

    // Adding validation to make sure title is provided before saving
    if (!data.title || data.title.trim() === "") {
        return res.status(400).json({ message: "Title is required" });
    }
    // Validating each question's required fields
    for (const [index, q] of data.questions.entries()) {
        if (!q.questionText || q.questionText.trim() === "") {
            return res
                .status(400)
                .json({
                    message: `Question text is required for question ${index + 1}`,
                });
        }
        // FIXED: Removed subtitle validation — subtitle is commented out in frontend so this was causing 400 Bad Request error
    }

    const finalData = {
        ...data,
        createdBy: id,
    };

    // Saveing finalData to database or performing other actions
    const createQuestionSet = new QuestionSet(finalData);
    await createQuestionSet.save();

    res.status(201).json({
        message: "Question set created successfully",
    });
}

async function viewAttemptHistoryController(req, res) {
    const { id: userId } = req.user;

    const history = await AnswerModel.find({ user: userId })
        .populate({
            path: "questionSet",
            select: "title questions",
        })
        .select("_id questionSet responses submittedAt feedback");

    res.json({ history });
}

// Counselor adds feedback to a student's submission
async function addCounselorFeedbackController(req, res) {
    const { answerId } = req.params;
    const { feedback } = req.body;

    if (
        !answerId ||
        answerId === "undefined" ||
        !mongoose.Types.ObjectId.isValid(answerId)
    ) {
        return res.status(400).json({ message: "Invalid or missing answer ID" });
    }

    const answer = await AnswerModel.findById(answerId);
    if (!answer) {
        return res.status(404).json({ message: "Submission not found" });
    }

    answer.feedback = feedback;
    await answer.save();

    res.json({
        message: "Feedback added successfully",
        feedback: answer.feedback,
    });
}


async function viewAllSubmissionsController(req, res) {
    const submissions = await AnswerModel.find()
        .populate("user", "name email")
        .populate({
            path: "questionSet",
            select: "title questions",
        })
        .select("_id user questionSet responses feedback submittedAt");

    res.json({
        submissions,
    });
}

async function saveFeedbackController(req, res) {
    try {
        const { attemptId } = req.params;
        const { feedbackTitle, feedbackText, counselorId, counselorName } = req.body;

        const attempt = await AnswerModel.findByIdAndUpdate(
            attemptId,
            {
                feedback: {
                    feedbackTitle,
                    feedbackText,
                    counselorId,
                    counselorName,
                    createdAt: new Date()
                }
            },
            { new: true }
        );

        if (!attempt) {
            return res.status(404).json({ message: "Attempt not found" });
        }

        return res.status(200).json({ message: "Feedback saved successfully", attempt });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to save feedback" });
    }
}

module.exports = {
    createQuestionSetController,
    addCounselorFeedbackController,
    viewAllSubmissionsController,
    viewAttemptHistoryController, 
    saveFeedbackController
};