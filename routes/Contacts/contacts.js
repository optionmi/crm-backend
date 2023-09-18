const express = require("express");
const router = express.Router();
const {
    createContact,
    getContactById,
    getAllContacts,
    searchContacts,
} = require("../../controllers/Contacts/contactsController");
const authenticateUser = require("../../middleware/auth");

router.get("/", authenticateUser(["publisher"]), searchContacts);
router.post("/", authenticateUser(), createContact);
router.get("/contacts/:id", authenticateUser(), getContactById);
router.get("/all", authenticateUser(), getAllContacts);

module.exports = router;
