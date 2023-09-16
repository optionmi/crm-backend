const express = require("express");
const router = express.Router();
const authenticateUser = require("../../middleware/auth");
const {
    createPublisher,
    getPublisherById,
    getAllPublishers,
    updatePublisherById,
    deletePublisherById,
} = require("../../controllers/Publishers/publisherController");

router.post("/create", authenticateUser(), createPublisher);
router.get("/all", authenticateUser(), getAllPublishers);
router.get("/:id", authenticateUser(), getPublisherById);
router.put("/:id", authenticateUser(), updatePublisherById);
router.delete("/:id", authenticateUser(), deletePublisherById);

module.exports = router;
