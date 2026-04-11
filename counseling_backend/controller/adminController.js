const QuestionSet = require("../model/QuestionSetModel");
const AnswerModel = require("../model/AnswerModel");
const User = require("../model/userModel");

// ================================
// VIEWING ALL QUESTION SETS
// ================================
async function getAllQuestionSetsController(req, res) {
    try {
        const questionSets = await QuestionSet.find()
            .populate("createdBy", "name email"); // show which counselor created it

        res.json({ questionSets });
    } catch (error) {
        res.status(500).json({ message: "Error fetching question sets", error: error.message });
    }
}

// ================================
// VIEWING ALL STUDENT RESPONSES
// ================================
async function getAllStudentResponsesController(req, res) {
    try {
        const responses = await Answer.find()
            .populate("studentId", "name email")
            .populate("questionSetId", "title")
            .sort({ completedAt: -1 });

        res.json({ responses });
    } catch (error) {
        res.status(500).json({ message: "Error fetching responses", error: error.message });
    }
}

// ================================
// VIEWING RESPONSES FOR A SPECIFIC QUESTION SET
// ================================
async function getResponsesByQuestionSetController(req, res) {
    try {
        const { questionSetId } = req.params;

        const responses = await Answer.find({ questionSetId })
            .populate("studentId", "name email")
            .populate("questionSetId", "title")
            .sort({ completedAt: -1 });

        res.json({ responses });
    } catch (error) {
        res.status(500).json({ message: "Error fetching responses", error: error.message });
    }
}

// ================================
// VIEWING RESPONSES OF A SPECIFIC STUDENT
// ================================
async function getResponsesByStudentController(req, res) {
    try {
        const { studentId } = req.params;

        const responses = await Answer.find({ studentId })
            .populate("studentId", "name email")
            .populate("questionSetId", "title")
            .sort({ completedAt: -1 });

        res.json({ responses });
    } catch (error) {
        res.status(500).json({ message: "Error fetching student responses", error: error.message });
    }
}



module.exports = {
    getAllQuestionSetsController,
    getAllStudentResponsesController,
    getResponsesByQuestionSetController,
    getResponsesByStudentController
}