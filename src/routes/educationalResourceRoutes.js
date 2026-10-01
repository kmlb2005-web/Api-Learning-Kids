const express = require("express");
const { createEducationalResource, getEducationalResources, getEducationalResourceById, updateEducationalResource, deleteEducationalResource } = require("../controllers/educationalResourceController");

const router = express.Router();

router.post("/", createEducationalResource);
router.get("/", getEducationalResources);
router.get("/:id", getEducationalResourceById);
router.put("/:id", updateEducationalResource);
router.delete("/:id", deleteEducationalResource);

module.exports = router;
