const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createSubject = async (req, res) => {
    const { name } = req.body;
    const { user } = req;

    try {
        if (user.user_type !== "admin" && user.user_type !== "publisher") {
            return res.status(403).json({ message: "Permission denied" });
        }

        let publisherId;

        if (user.user_type === "publisher") {
            const publisher = await prisma.publishers.findUnique({
                where: { user_id: user.id },
            });

            if (!publisher) {
                return res.status(404).json({ message: "Publisher not found" });
            }
            publisherId = publisher.id;
        } else {
            publisherId = null;
        }

        const newSubject = await prisma.subjects.create({
            data: {
                name,
            },
        });

        res.status(201).json({
            message: "Subject created successfully!",
            ...newSubject,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

const getAllSubjects = async (req, res) => {
    try {
        const Subjects = await prisma.subjects.findMany();

        if (Subjects.length > 0) {
            return res.status(200).json({ Subjects });
        } else {
            return res.status(404).json({ message: "No Subjects found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

// Function to fetch a Subject by ID (accessible to all users)
const getSubjectById = async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        res.status(400).send({ message: "Invalid ID" });
        return;
    }

    try {
        // const Subject = await Subjects.findByPk(id);
        const Subject = await prisma.subjects.findUnique({ where: { id } });

        if (Subject) {
            return res.status(200).json(Subject);
        } else {
            return res.status(404).json({ message: "Subject not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

// Function to update a Subject (accessible to publishers)
const updateSubject = async (req, res) => {
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

        // Find the Subject by ID and update it
        // const [updatedRows] = await Subjects.update(updatedData, {
        //     where: { id },
        // });
        const updatedRow = await prisma.subjects.update({
            where: { id },
            data: { ...updatedData },
        });

        if (updatedRow) {
            return res.status(200).json({
                message: "Subject updated successfully!",
                data: updatedRow,
            });
        } else {
            return res.status(404).json({ message: "Subject not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};
const deleteSubject = async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        res.status(400).send({ message: "Invalid ID" });
        return;
    }

    try {
        const deletedSubject = await prisma.subjects.delete({
            where: { id },
        });
        res.status(200).json({
            message: "Subject deleted successfully!",
            ...deletedSubject,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to delete Subject");
    }
};

module.exports = {
    createSubject,
    getAllSubjects,
    getSubjectById,
    updateSubject,
    deleteSubject,
};
