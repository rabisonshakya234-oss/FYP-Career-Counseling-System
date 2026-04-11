const Decision = require("../model/DecisionModel");

// Creating a new Decision
async function createDecisionController(req, res) {
    try {
        const newDecision = new Decision(req.body);
        await newDecision.save();
        res.status(201).json(newDecision); // ✅ FIXED: added response after save
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a decision by ID
async function getDecisionById(req, res) {
    try {
        const decision = await Decision.findById(req.params.id);
        if (!decision) return res.status(404).send("Decision not found");
        res.json(decision);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update an existing decision
async function updateDecisionController(req, res) {
    try {
        const decision = await Decision.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!decision) return res.status(404).send("Decision not found");
        res.json(decision);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createDecisionController,
    getDecisionById,
    updateDecisionController,
}