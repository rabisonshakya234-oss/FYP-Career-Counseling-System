const Message = require("../model/MessageModel");
const Conversation = require("../model/ConverstationModel");
const User = require("../model/userModel");
const { getIO } = require("../Socket io/socket");
const mongoose = require("mongoose");

// -----------------------------
// Auto-join chats for student or counselor (exactly as provided)
// -----------------------------
async function autoJoinChatController(currentUserId, role) {

    // Step 1: Create missing chats for students
    if (role === "student") {
        const student = await User.findById(currentUserId);
        if (student && student.assignedCounselor) {
            const counselorId = student.assignedCounselor;
            const existingChat = await Conversation.findOne({
                participants: { $all: [currentUserId, counselorId] }
            });
            if (!existingChat) {
                await Conversation.create({
                    participants: [currentUserId, counselorId]
                });
            }
        }
    }

    // Step 2: Create missing chats for counselors
    else if (role === "counselor") {
        const students = await User.find({ assignedCounselor: currentUserId }).lean();
        for (const student of students) {
            const existingChat = await Conversation.findOne({
                participants: { $all: [student._id, currentUserId] }
            });
            if (!existingChat) {
                await Conversation.create({
                    participants: [student._id, currentUserId]
                });
            }
        }
    }

    // Step 3: Fetch all chats AFTER creation
    const chats = await Conversation.find({ participants: currentUserId })
        .populate("participants", "_id name");

    return chats;
}

// -----------------------------
// Sending message
// -----------------------------
async function sendMessageController(req, res) {
    try {
        const { conversationId, senderId, recieverId, message, messageType, attachments } = req.body;

        if (!conversationId || !senderId || !recieverId || !message) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const newMessage = new Message({
            conversationId,
            sender: senderId,
            reciever: recieverId,
            message,
            messageType,
            attachments,
        });

        await newMessage.save();

        await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: newMessage._id
        });

        res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: newMessage,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Message is not sent",
            error: error.message,
        });
    }
}

// -----------------------------
// Get messages
// -----------------------------
async function getMessagesController(req, res) {
    try {
        const conversationId = req.params.conversationId;
        const { limit = 20, skip = 0 } = req.query;

        if (!conversationId || !mongoose.Types.ObjectId.isValid(conversationId)) {
            return res.status(400).json({
                success: false,
                message: "Conversation ID is required",
            });
        }

        const messages = await Message.find({ conversationId: new mongoose.Types.ObjectId(conversationId) })
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip))
            .populate("sender", "name role")
            .populate("reciever", "name email");

        res.status(200).json({
            success: true,
            message: "Messages retrieved successfully",
            data: messages,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get messages",
            error: error.message,
        });
    }
}

// -----------------------------
// Mark messages as read
// -----------------------------
async function markAsReadController(req, res) {
    try {
        const { conversationId, userId } = req.body;

        const result = await Message.updateMany(
            { conversationId, reciever: userId, isRead: false },
            { isRead: true, readAt: new Date() },
        );

        res.status(200).json({
            modifiedCount: result.modifiedCount,
            success: true,
            message: "Messages marked as read",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to mark message as read",
            error: error.message,
        });
    }
}

// -----------------------------
// Get chat list
// -----------------------------
async function getChatListController(req, res) {
    try {
        const currentUserId = req.user.id;
        const chats = await Conversation.find({ participants: currentUserId })
            .populate("participants", "_id name");

        res.status(200).json({
            success: true,
            data: chats
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch chat list",
        });
    }
}

// -----------------------------
// Getting counselors Controller
// -----------------------------
async function getCounselorsController(req, res) {
    try {
        const { field } = req.query;
        const query = { role: "counselor" };

        if (field && field.trim() !== "") query.field = field;

        const counselors = await User.find(query).select("_id name field");

        res.status(200).json({ success: true, data: counselors });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

// -----------------------------
// HTTP Auto-join endpoint
// -----------------------------
async function autoJoinChatHttpController(req, res) {
    try {
        const currentUserId = req.user.id;
        const role = req.user.role;

        const chats = await autoJoinChatController(currentUserId, role);

        // make sure that socket joins all the chat rooms
        try {
            const io = getIO();

            chats.forEach(chat => {
                io.to(currentUserId).socketsJoin(chat._id.toString());
            });
        } catch (error) {
            console.error("Socket join error:", socketerror);
        }

        res.status(200).json({
            success: true,
            message: "Auto-joined chat rooms successfully",
            data: chats,
        });

    } catch (error) {
        console.error("Auto-join error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to auto-join chat rooms",
            error: error.message,
        });
    }

}
// delete messages controller 
async function deleteMessagesController(req, res) { 
    try {
        const { messageId } = req.params;
        const message = await Message.findByIdAndDelete(messageId);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Message deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete message",
            error: error.message,
        });
    }
}

module.exports = {
    sendMessageController,
    getMessagesController,
    markAsReadController,
    autoJoinChatController,
    autoJoinChatHttpController,
    getChatListController,
    getCounselorsController,
    deleteMessagesController
};