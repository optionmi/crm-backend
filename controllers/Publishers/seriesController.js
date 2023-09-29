const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createSeries = async (req, res) => {
    const { name, subject_id } = req.body;
    const { user } = req;

    try {
        if (user.user_type !== "admin" && user.user_type !== "publisher") {
            return res.status(403).json({ message: "Permission denied" });
        }

        let publisherId = null;

        if (user.user_type === "publisher") {
            const publisher = await prisma.publishers.findUnique({
                where: { user_id: user.id },
            });

            if (!publisher) {
                return res.status(404).json({ message: "Publisher not found" });
            }
            publisherId = publisher.id;
        }

        const newSeries = await prisma.series.create({
            data: {
                name,
                subject: { connect: { id: parseInt(subject_id) } },
            },
        });

        res.status(201).json({
            message: "Series created successfully!",
            ...newSeries,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

const getAllSeries = async (req, res) => {
    try {
        const series = await prisma.series.findMany({
            include: { subject: true },
        });

        if (series.length > 0) {
            return res.status(200).json(series);
        } else {
            return res.status(404).json({ message: "No series found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

const getSeriesById = async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }

    try {
        const series = await prisma.series.findUnique({ where: { id } });

        if (series) {
            return res.status(200).json(series);
        } else {
            return res.status(404).json({ message: "Series not found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server Error");
    }
};

const updateSeries = async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }

    const updatedData = req.body;

    try {
        if (!["admin", "publisher"].includes(req.user.user_type)) {
            return res.status(403).json({ message: "Permission denied" });
        }

        const updatedRow = await prisma.series.update({
            where: { id },
            data: { ...updatedData },
        });

        if (updatedRow) {
            return res.status(200).json({
                message: "Series updated successfully!",
                ...updatedRow,
            });
        } else {
            return res.status(404).json({ message: "Series not found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server Error");
    }
};
const deleteSeries = async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).send({ message: "Invalid ID" });
    }

    try {
        const deletedSeries = await prisma.series.delete({
            where: { id },
        });

        if (!deletedSeries) {
            return res.status(404).send("Series not found");
        }

        return res.status(200).json({
            message: "Series deleted successfully!",
            ...deletedSeries,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Failed to delete Series" });
    }
};

const getSeriesBySubjectId = async (req, res) => {
    const subjectId = parseInt(req.params.id);
    if (isNaN(subjectId)) {
        return res.status(400).send({ message: "Invalid ID" });
    }

    try {
        const series = await prisma.series.findMany({
            where: {
                subject_id: subjectId,
            },
        });

        if (series.length > 0) {
            return res.status(200).json(series);
        } else {
            return res
                .status(404)
                .json({ message: "No series found for the subject" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server Error");
    }
};

module.exports = {
    getSeriesBySubjectId,
};

module.exports = {
    createSeries,
    getAllSeries,
    getSeriesById,
    updateSeries,
    deleteSeries,
    getSeriesBySubjectId,
};
