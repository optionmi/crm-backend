const express = require("express");
const router = express.Router();
const {
    createSalesperson,
    getSalespersonById,
    getAllSalespersons,
    searchSalespersonsByName,
    searchSalespersonsByTeam,
    updateSalespersonById,
    deleteSalespersonById,
} = require("../../controllers/Salespersons/salespersonController");
const authenticateUser = require("../../middleware/auth");

router.get("/", authenticateUser(["publisher"]), searchSalespersonsByName);
router.get(
    "/salespersons",
    authenticateUser(["publisher"]),
    searchSalespersonsByTeam
);
router.post("/", authenticateUser(), createSalesperson);
router.get("/salespersons/:id", authenticateUser(), getSalespersonById);
router.get("/all", authenticateUser(), getAllSalespersons);
router.put("/:id", authenticateUser(), updateSalespersonById);
router.delete("/:id", authenticateUser(), deleteSalespersonById);

module.exports = router;
