const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
    createLead,
    getAllLeads,
    getLeadById,
    updateLeadById,
    updateLeadStage,
    addNote,
    addFile,
    addActivity,
    DailyPlanning,
} = require("../../controllers/Salespersons/leadsController");
const authenticateUser = require("../../middleware/auth");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "files/lead/");
    },
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    },
});
const upload = multer({ storage });

router.get("/all", authenticateUser(), getAllLeads);
router.post("/create", authenticateUser(), createLead);
router.post("/update-stage/:id", authenticateUser(), updateLeadStage);
router.post("/add-note/:id", authenticateUser(), addNote);
router.post("/add-activity/:id", authenticateUser(), addActivity);
router.post("/add-visit/:id", authenticateUser(), DailyPlanning);
router.post(
    "/add-file/:id",
    authenticateUser(),
    upload.single("file"),
    addFile
);
router.get("/:id", authenticateUser(), getLeadById);
router.post("/:id", authenticateUser(), updateLeadById);

module.exports = router;
