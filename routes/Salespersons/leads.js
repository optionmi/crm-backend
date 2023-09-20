const express = require("express");
const router = express.Router();
const {
    createLead,
    getAllLeads,
    getLeadById,
    updateLeadById,
} = require("../../controllers/Salespersons/leadsController");
const authenticateUser = require("../../middleware/auth");

router.get("/all", authenticateUser(), getAllLeads);
router.post("/create", authenticateUser(), createLead);
router.get("/:id", authenticateUser(), getLeadById);
router.post("/:id", authenticateUser(), updateLeadById);

module.exports = router;
