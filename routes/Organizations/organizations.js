const express = require("express");
const router = express.Router();
const {
    createOrganization,
    getAllOrganizations,
    deleteOrganizationById,
    getOrganizationById,
    updateOrganizationById,
    searchOrganizations,
} = require("../../controllers/Organizations/organizationsController");
const authenticateUser = require("../../middleware/auth");

router.post("/create", authenticateUser(), createOrganization);
router.get("/all", authenticateUser(), getAllOrganizations);
router.get("/:id", authenticateUser(), getOrganizationById);
router.delete("/:id", authenticateUser(), deleteOrganizationById);
router.put("/:id", authenticateUser(), updateOrganizationById);
router.get("/", authenticateUser(), searchOrganizations);

module.exports = router;
