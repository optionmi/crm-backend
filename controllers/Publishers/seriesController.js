const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Function to create a new Series (accessible to publishers)
const createSeries = async (req, res) => {
    const { title, author, board, standard, subject, price } = req.body;
    const { user } = req;

    try {
        // Check if the user is an admin or publisher
        if (user.user_type !== "admin" && user.user_type !== "publisher") {
            return res.status(403).json({ message: "Permission denied" });
        }

        let publisherId;

        if (user.user_type === "publisher") {
            // If the user is a publisher, use their own publisher ID
            // const publisher = await Publishers.findOne({
            //     where: { user_id: user.id },
            // });
            const publisher = await prisma.publishers.findUnique({
                where: { user_id: user.id },
            });

            if (!publisher) {
                return res.status(404).json({ message: "Publisher not found" });
            }
            publisherId = publisher.id;
        } else {
            // If the user is an admin, set the publisher ID to null (or a default value)
            publisherId = null; // Set to null or a default value as needed
        }

        // Create the Series
        // const Series = await Series.create({
        //     title,
        //     author,
        //     board,
        //     standard,
        //     subject,
        //     price,
        //     publisher_id: publisherId,
        // });
        const Series = await prisma.Series.create({
            data: {
                title,
                author,
                board,
                standard,
                subject,
                price,
                publisher_id: publisherId,
            },
        });

        res.status(201).json(Series);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

// Function to fetch all Series (accessible to all users)
const getAllSeries = async (req, res) => {
    try {
        // const Series = await Series.findAll();
        const Series = await prisma.Series.findMany();

        if (Series.length > 0) {
            return res.status(200).json(Series);
        } else {
            return res.status(404).json({ message: "No Series found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

// Function to fetch a Series by ID (accessible to all users)
const getSeriesById = async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        res.status(400).send({ message: "Invalid ID" });
        return;
    }

    try {
        // const Series = await Series.findByPk(id);
        const Series = await prisma.Series.findUnique({ where: { id } });

        if (Series) {
            return res.status(200).json(Series);
        } else {
            return res.status(404).json({ message: "Series not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

// Function to update a Series (accessible to publishers)
const updateSeries = async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        res.status(400).send({ message: "Invalid ID" });
        return;
    }

    const updatedData = req.body; // ToDo Validate Incoming Data

    try {
        // Check if the user is an admin or publisher
        if (
            req.user.user_type !== "admin" &&
            req.user.user_type !== "publisher"
        ) {
            return res.status(403).json({ message: "Permission denied" });
        }

        // Find the Series by ID and update it
        // const [updatedRows] = await Series.update(updatedData, {
        //     where: { id },
        // });
        const updatedRow = await prisma.Series.update({
            where: { id },
            data: { ...updatedData },
        });

        if (updatedRow) {
            return res.status(200).json({
                message: "Series data updated successfully",
                data: updatedRow,
            });
        } else {
            return res.status(404).json({ message: "Series not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};
const deleteSeries = async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        res.status(400).send({ message: "Invalid ID" });
        return;
    }

    try {
        const deletedSeries = await prisma.Series.delete({
            where: { id },
        });
        res.status(200).json({
            message: "Series Deleted Successfully!",
            data: deletedSeries,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to delete Series");
    }
};

module.exports = {
    createSeries,
    getAllSeries,
    getSeriesById,
    updateSeries,
    deleteSeries,
};
