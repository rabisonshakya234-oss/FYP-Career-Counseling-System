const AnswerModel = require("../model/AnswerModel");
const QuestionSet = require("../model/QuestionSetModel");
const UserModel = require("../model/userModel");
async function listQuestionSetsController(req, res) {
    const questionSet = await QuestionSet.aggregate([
        {
            $project: {
                title: 1,
                questionCount: { $size: { $ifNull: ["$questions", []] } },
            },
        },
    ]);

    res.json({
        questionSet: questionSet,
    });
}

async function getQuestionSetController(req, res) {
    const { id } = req.params;
    const questionSet = await QuestionSet.findById(id).select(
        "questions._id questions.questionText questions.choices._id questions.choices.label questions.choices.text ",
    );
    if (!questionSet) {
        return res.status(404).json({ message: "Question set not found" });
    }

    res.json(questionSet);
}

async function saveAttemptedQuestionController(req, res) {
    const { questionSet: questionSetId, responses } = req.body;
    const { id: userId } = req.user;

    // fallback if user info missing
    const userDoc = await UserModel.findById(userId).select("name email");
    const name = userDoc?.name || req.user.name || "Unknown";
    const email = userDoc?.email || req.user.email || "Unknown@example.com";
    const questionSet = await QuestionSet.findById(questionSetId).select(
        "questions._id questions.choices._id",
    );

    if (!questionSet)
        return res.status(404).json({ message: "QuestionSet not found" });

    const result = (responses || []).reduce(
        (acc, current) => {
            const questions = Array.isArray(questionSet?.questions)
                ? questionSet.questions
                : Array.isArray(questionSet)
                    ? questionSet
                    : [];

            const q = questions.find(
                (qn) => String(qn._id) === String(current.questionId),
            );
            if (!q) return acc;

            const selected = current.selectedChoiceIds || [];

            acc.details.push({
                questionId: String(q._id),
                selectedChoiceIds: selected.map(String),
            });

            return acc;
        },
        { details: [] },
    );

    const saveAnswerQuestion = new AnswerModel({
        questionSet: questionSetId,
        user: userId,
        responses: responses.map((r) => ({
            ...r,
            studentId: r.studentId || userId, // inject if missing
            name: r.name || name,
            email: r.email || email,
            selectedChoiceIds: r.selectedChoiceIds || [], // ensure this field exists
        })),
        feedback: null,
    });

    await saveAnswerQuestion.save();
    return res.status(201).json({
        message: "Submitted",
        data: {
            responses: responses,
        },
    });
}

// System feedback generator 
async function generateSystemFeedbackController(responses) {
    if (!responses || responses.length === 0) {
        return "No responses were recorded for this assessment.";
    }

    const totalQuestions = responses.length;

    return `
You have completed an assessment consisting of ${totalQuestions} questions.
Your responses show thoughtful engagement and interest in career planning.
This assessment highlights your willingness to explore suitable career paths.
These insights can support informed decisions for your future career journey.
`.trim();
}

/* Submitting assessment */
async function submitAssessementController(req, res) {
    try {
        let { questionSet, user, responses } = req.body;

        // Inject user info if missing to satisfy Mongoose validation
        const fallbackUserId = req.user?.id || user;
        const name = req.user?.name || "Unknown";
        const email = req.user?.email || "Unknown@example.com";

        responses = responses.map((r) => ({
            ...r,
            studentId: r.studentId || fallbackUserId,
            name: r.name || name,
            email: r.email || email,
        }));

        if (!user) user = fallbackUserId;

        const systemFeedback = await generateSystemFeedbackController(responses);

        const answer = await AnswerModel.create({
            questionSet,
            user,
            responses,
            systemFeedback,
        });
        
        res.status(201).json({
            message: "Assessment Submitted successfully",
            answer
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "submission failed" });
    }
}

module.exports = {
    listQuestionSetsController,
    getQuestionSetController,
    saveAttemptedQuestionController,
    submitAssessementController,
};
