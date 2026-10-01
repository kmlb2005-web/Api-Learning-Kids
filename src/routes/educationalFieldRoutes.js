const express = require("express");
const { createEducationalField, getEducationalFields, getEducationalFieldById, updateEducationalField, deleteEducationalField } = require("../controllers/educationalFieldController");

const router = express.Router();

router.post("/", createEducationalField);
router.get("/", getEducationalFields);
router.get("/:id", getEducationalFieldById);
router.put("/:id", updateEducationalField);
router.delete("/:id", deleteEducationalField);

module.exports = router;
