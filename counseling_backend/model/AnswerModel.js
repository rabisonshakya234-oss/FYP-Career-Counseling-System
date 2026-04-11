const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
	questionSet: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "QuestionSet",
		required: true,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	responses: [
		{
			studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
			name: { type: String, required: true },
			email: { type: String, required: true },
			questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
			selectedChoiceIds: [{ type: mongoose.Schema.Types.ObjectId, required: true }],

			manualFeedback: {
				counselorName: { type: String, default: "" },
				feedbackText: { type: String, default: "" }
			}
		}
	],

	systemFeedback: { type: String, default: "" },

	// optional for overall feedback of students
	counselorFeedback: { type: String, default: ""},
	// score: { type: Number, default: 0 }, // Number of correct answers
	// total: { type: Number, default: 0 }, // Total questions in this attempt
	submittedAt: {
		type: Date,
		default: Date.now,
	},

	feedback: {
		feedbackTitle: { type: String },
		feedbackText: { type: String },
		counselorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		counselorName: { type: String },
		createdAt: { type: Date},	
	},
});

const AnswerModel = mongoose.model("Answer", AnswerSchema);
module.exports = AnswerModel;