const express = require("express");
const router = express.Router();
const authenticateUser = require("../../middleware/auth");
const {
    createSeries,
    getSeriesById,
    updateSeries,
    getAllSeries,
    deleteSeries,
    getSeriesBySubjectId,
} = require("../../controllers/Publishers/seriesController");

router.post("/create", authenticateUser(), createSeries);
router.get("/all", authenticateUser(), getAllSeries);
router.get("/subject/:id", authenticateUser(), getSeriesBySubjectId);
router.get("/:id", authenticateUser(), getSeriesById);
router.put("/:id", authenticateUser(), updateSeries);
router.delete("/:id", authenticateUser(), deleteSeries);

module.exports = router;
