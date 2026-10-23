
const express = require("express");

const {
  createChatMessage,
  getChatMessages,
  getChatMessageById,
  updateChatMessage,
  deleteChatMessage
} = require("../controllers/chatMessageController");

const { askAI } = require("../controllers/chatController");

const router = express.Router();

// Ruta para consultar la IA de LearningKids
router.post("/ask", askAI);

// Rutas CRUD de mensajes
router.post("/", createChatMessage);
router.get("/", getChatMessages);
router.get("/:id", getChatMessageById);
router.put("/:id", updateChatMessage);
router.delete("/:id", deleteChatMessage);

module.exports = router;
