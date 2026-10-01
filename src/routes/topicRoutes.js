const express = require("express");
const { createTopic, getTopics, getTopicById, updateTopic, deleteTopic } = require("../controllers/topicController");

const router = express.Router();

router.post("/", createTopic);
router.get("/", getTopics);
router.get("/:id", getTopicById);
router.put("/:id", updateTopic);
router.delete("/:id", deleteTopic);

module.exports = router;
