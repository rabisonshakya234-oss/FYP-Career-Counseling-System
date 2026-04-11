const express = require("express");
const { validateTokenMiddleware } = require("../middleware/AuthMiddleware");
const { sendMessageController, getMessagesController, markAsReadController, getChatListController, getCounselorsController, autoJoinChatHttpController, deleteMessagesController } = require("../controller/chatController");

const router = express.Router();

// Route: Send a new message
// using post API
router.post("/send", validateTokenMiddleware, sendMessageController);

// New route — call this right after login to auto-join all chat rooms
router.post("/auto-join", validateTokenMiddleware, autoJoinChatHttpController);

// Route: Mark messages as read 
// using post API
router.post("/read", validateTokenMiddleware, markAsReadController);

// FIXED: changed from POST to GET — getCounselorsController only reads data,
// it uses req.query (not req.body), so POST was wrong and query params don't
// work on POST in the same way. GET is the correct HTTP method here.
router.get("/counselors", validateTokenMiddleware, getCounselorsController);

// Route: Get chat list for the user
// FIXED: moved /list ABOVE /:conversationId — Express matches routes top to bottom,
// so "list" was being captured as a conversationId param and failing with a cast error
router.get("/list", validateTokenMiddleware, getChatListController);

// Route: Get messages for a conversation
// using get API
router.get("/:conversationId", validateTokenMiddleware, getMessagesController);

// delete route for testing purposes only
router.delete("/message/:messageId", validateTokenMiddleware, deleteMessagesController);

module.exports = router;