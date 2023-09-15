const express = require("express");
const router = express.Router();
const authenticateUser = require("../../middleware/auth");
const {
    createSubject,
    getSubjectById,
    updateSubject,
    getAllSubjects,
    deleteSubject,
} = require("../../controllers/Publishers/subjectsController");

router.post("/create", authenticateUser(), createSubject);
router.get("/all", authenticateUser(), getAllSubjects);
router.get("/:id", authenticateUser(), getSubjectById);
router.put("/:id", authenticateUser(), updateSubject);
router.delete("/:id", authenticateUser(), deleteSubject);

module.exports = router;
