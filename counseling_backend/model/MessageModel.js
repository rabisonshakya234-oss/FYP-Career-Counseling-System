const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    reciever: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
        trim: true,
    },
    messageType: {
        type: String,
        enum: ["text", "image", "file", "document"],
        default: "text",
    },

    isRead: {
        type: Boolean,
        default: false,
    },
    readAt: {
        type: Date, // timestamp of when the message was read
    },
    attachments: [
        {
            filename: String,
            url: String,
            fileType: String,
            size: Number,
        },
    ],
},
    { timestamps: true },
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;