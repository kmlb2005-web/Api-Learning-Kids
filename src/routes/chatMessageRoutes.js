const express = require("express");
const { createChatMessage, getChatMessages, getChatMessageById, updateChatMessage, deleteChatMessage } = require("../controllers/chatMessageController");

const router = express.Router();

router.post("/", createChatMessage);
router.get("/", getChatMessages);
router.get("/:id", getChatMessageById);
router.put("/:id", updateChatMessage);
router.delete("/:id", deleteChatMessage);

module.exports = router;
