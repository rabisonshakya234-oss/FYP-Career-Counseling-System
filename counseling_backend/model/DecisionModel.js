const mongoose = require("mongoose");

// Define proConSchema FIRST
const proConSchema = new mongoose.Schema({
    text: { type: String, required: true },
    weight: { type: Number, required: true },
    category: { type: String, required: true },
});

// Then optionSchema
const optionSchema = new mongoose.Schema({
    optionName: { type: String, required: true },
    pros: [proConSchema],
    cons: [proConSchema],
});

// Then main decisionSchema
const decisionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    options: [optionSchema],
});

module.exports = mongoose.model("Decision", decisionSchema);