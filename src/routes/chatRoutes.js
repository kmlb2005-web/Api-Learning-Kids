const express = require("express");
const { createChat, getChats, getChatById, updateChat, deleteChat } = require("../controllers/chatController");

const router = express.Router();

router.post("/", createChat);
router.get("/", getChats);
router.get("/:id", getChatById);
router.put("/:id", updateChat);
router.delete("/:id", deleteChat);

module.exports = router;
