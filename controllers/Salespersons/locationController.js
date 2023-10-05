const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new location
const createLocation = async (req, res) => {
    try {
        const { id, latitude, longitude } = req.body;

        const user = await prisma.salespeople.findFirst({
            where: { user_id: id, team: "SalesTeam" },
        });

        if (user) {
            const location = await prisma.location.create({
                data: {
                    salesperson_id: user.id,
                    latitude,
                    longitude,
                },
            });
            return res.status(201).json(location);
        }
    } catch (error) {
        console.error("Error creating location:", error);
        res.status(500).json({ error: "Unable to create location" });
    }
};

// Update an existing location
const updateLocation = async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).send({ message: "Invalid ID" });
    }

    const locationData = req.body;

    try {
        const updatedRow = await prisma.location.update({
            where: { id },
            data: { ...locationData },
        });

        if (updatedRow) {
            return res.status(200).json({
                message: "Location updated successfully!",
                data: updatedRow,
            });
        } else {
            return res.status(404).json({ message: "Location not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

// Get all locations for a specific salesperson
const getLocationsByID = async (req, res) => {
    try {
        const { id } = req.params;

        const locations = await prisma.location.findFirst({
            where: { salesperson_id: parseInt(id) },
        });

        res.status(200).json(locations);
    } catch (error) {
        console.error("Error retrieving locations:", error);
        res.status(500).json({ error: "Unable to retrieve locations" });
    }
};

// Check if the user is there or not
const has_location = async (req, res) => {
    try {
        const { id } = req.body;

        const user = await prisma.salespeople.findFirst({
            where: { user_id: id, team: "SalesTeam" },
        });

        if (user) {
            const response = await prisma.location.findFirst({
                where: {
                    salesperson_id: user.id,
                },
            });
            if (response) {
                res.status(201).json({
                    message: "yes",
                    locationId: response.id,
                });
            } else {
                res.status(201).json({
                    message: "no",
                });
            }
        }
    } catch (error) {
        console.error("Error fetching location:", error);
        res.status(500).json({ error: "Unable to fetch location" });
    }
};

module.exports = {
    createLocation,
    updateLocation,
    getLocationsByID,
    has_location,
};
