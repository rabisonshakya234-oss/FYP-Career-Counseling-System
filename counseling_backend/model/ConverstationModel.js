const mongoose = require("mongoose");

const conversationSechema = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    ],

    // student/counselor
    conversationType: {
        type: String,
        enum: ["counseling"],
        default: "counseling",
        required: true,
    },

    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
    },
},
    { timestamps: true },
);

const Conversation = mongoose.model("Conversation", conversationSechema);
module.exports = Conversation;