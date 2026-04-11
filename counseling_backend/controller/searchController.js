// Fixed imports: removed Counselor import as it's not needed
const QuestionSet = require("../model/QuestionSetModel"); // ✅ Fixed: matches usage
const userModel = require("../model/userModel");           // ✅ Already imported

const searchController = async (req, res) => {
	try {
		const query = req.query.q;

		if (!query) {
			return res.json([]);
		}

		// case-insensitive regex search
		const regex = new RegExp(query, "i");

		// ✅ Search QuestionSets
		const questionResults = await QuestionSet.find({
			title: { $regex: regex },
		}).select("title");

		const formattedQuestions = questionResults.map((q) => ({
			id: q._id,
			title: q.title,
			type: "question",
		}));

		// ✅ Search Users
		const userResults = await userModel.find({
			name: { $regex: regex }, // ✅ Fixed: using userModel and name field
		}).select("name");

		const formattedUsers = userResults.map((u) => ({
			id: u._id,
			name: u.name,
			type: "user",
		}));

		// merge results
		const results = [...formattedQuestions, ...formattedUsers];

		return res.json(results);
	} catch (error) {
		console.error("Search Error:", error);
		return res.status(500).json({ error: "Server Error" });
	}
};

module.exports = { searchController };