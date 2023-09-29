const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Function to create a new Board (accessible to publishers)
const createBoard = async (req, res) => {
    const { name } = req.body;
    const user = req.user;

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

        // Create the Board
        // const Board = await Boards.create({
        //     title,
        //     author,
        //     board,
        //     standard,
        //     subject,
        //     price,
        //     publisher_id: publisherId,
        // });
        const Board = await prisma.boards.create({
            data: {
                name,
            },
        });

        res.status(201).json(Board);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

// Function to fetch all Boards (accessible to all users)
const getAllBoards = async (req, res) => {
    try {
        const boards = await prisma.boards.findMany();

        if (boards) {
            return res.status(200).json(boards);
        } else {
            return res.status(404).json({ message: "No Boards found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

// Function to fetch a Board by ID (accessible to all users)
const getBoardById = async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        res.status(400).send({ message: "Invalid ID" });
        return;
    }

    try {
        // const Board = await Boards.findByPk(id);
        const Board = await prisma.boards.findUnique({ where: { id } });

        if (Board) {
            return res.status(200).json(Board);
        } else {
            return res.status(404).json({ message: "Board not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

// Function to update a Board (accessible to publishers)
const updateBoard = async (req, res) => {
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

        // Find the Board by ID and update it
        // const [updatedRows] = await Boards.update(updatedData, {
        //     where: { id },
        // });
        const updatedRow = await prisma.boards.update({
            where: { id },
            data: { ...updatedData },
        });

        if (updatedRow) {
            return res.status(200).json({
                message: "Board updated successfully!",
                data: updatedRow,
            });
        } else {
            return res.status(404).json({ message: "Board not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};
const deleteBoard = async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        res.status(400).send({ message: "Invalid ID" });
        return;
    }

    try {
        const deletedBoard = await prisma.boards.delete({
            where: { id },
        });
        res.status(200).json({
            message: "Board deleted successfully!",
            data: deletedBoard,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to delete Board" });
    }
};

module.exports = {
    createBoard,
    getAllBoards,
    getBoardById,
    updateBoard,
    deleteBoard,
};
