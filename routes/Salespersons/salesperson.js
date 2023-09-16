const express = require("express");
const router = express.Router();
const {
    createSalesperson,
    getSalespersonById,
    getAllSalespersons,
    searchSalespersonsByName,
} = require("../../controllers/Salespersons/salespersonController");
const authenticateUser = require("../../middleware/auth");

router.get("/", authenticateUser(["publisher"]), searchSalespersonsByName);
router.post("/", authenticateUser(), createSalesperson);
router.get("/salespersons/:id", authenticateUser(), getSalespersonById);
router.get("/all", authenticateUser(), getAllSalespersons);

module.exports = router;
