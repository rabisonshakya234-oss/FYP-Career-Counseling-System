// Importing  mongoose library

const { mongoose } = require("mongoose");

// Defining the user schema

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    role: {
        type: String,
        enum: ["student", "counselor", "admin"],
        default: "student",
    },
    field: { type: String },
    assignedCounselor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,  
    },
    conversations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Conversation"}]
})

const User = mongoose.model("User", userSchema);
module.exports = User;