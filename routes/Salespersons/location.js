const express = require("express");
const router = express.Router();
const {
    createLocation,
    updateLocation,
    getLocationsByID,
    has_location,
} = require("../../controllers/Salespersons/locationController");
const authenticateUser = require("../../middleware/auth");

router.post("/", authenticateUser(), createLocation);
router.put("/:id", authenticateUser(), updateLocation);
router.get("/salespersons/:id", authenticateUser(), getLocationsByID);
router.get("/has_location/:id", authenticateUser(), has_location);

module.exports = router;
