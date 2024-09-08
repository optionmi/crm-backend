const express = require("express");
const router = express.Router();
const {
    createContact,
    getContactById,
    getAllContacts,
    searchContacts,
    updateContactById,
    deleteContactByID,
} = require("../../controllers/Contacts/contactsController");
const authenticateUser = require("../../middleware/auth");

router.get("/all", authenticateUser(), getAllContacts);
router.post("/create", authenticateUser(), createContact);
router.get("/:id", authenticateUser(), getContactById);
router.put("/:id", authenticateUser(), updateContactById);
router.delete("/:id", authenticateUser(), deleteContactByID);
router.get("/", authenticateUser(["publisher"]), searchContacts);

module.exports = router;
