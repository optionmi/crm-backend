const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createBook = async (req, res) => {
    const { title, author, board_id, subject_id, series_id, standard, price } =
        req.body;
    const { user } = req;

    try {
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

        const book = await prisma.books.create({
            data: {
                title,
                author,
                standard,
                price,
                publishers: publisherId
                    ? { connect: { id: publisherId } }
                    : undefined,
                board: {
                    connect: { id: parseInt(board_id) },
                },
                subject: {
                    connect: { id: parseInt(subject_id) },
                },
                series: { connect: { id: parseInt(series_id) } },
            },
        });

        res.status(201).json({
            message: "Book created successfully!",
            ...book,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

const getAllBooks = async (req, res) => {
    try {
        const books = await prisma.books.findMany();

        if (!books.length) {
            return res.status(404).json({ message: "No books found" });
        }

        return res.json({ books });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Server Error");
    }
};

const getBookById = async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }

    try {
        const book = await prisma.books.findUnique({
            where: { id },
            include: { series: true },
        });

        if (book) {
            return res.status(200).json(book);
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server Error");
    }
};

const updateBook = async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).send({ message: "Invalid ID" });
    }

    const { title, author, board_id, subject_id, series_id, standard, price } =
        req.body;

    try {
        const updatedRow = await prisma.books.update({
            where: { id },
            data: {
                title,
                author,
                standard,
                price,
                board: {
                    connect: { id: board_id },
                },
                subject: {
                    connect: { id: subject_id },
                },
                series: { connect: { id: series_id } },
            },
        });

        if (updatedRow) {
            return res.status(200).json({
                message: "Book updated successfully!",
                data: updatedRow,
            });
        }

        return res.status(404).json({ message: "Book not found" });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server Error");
    }
};
const deleteBook = async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        res.status(400).send({ message: "Invalid ID" });
        return;
    }

    try {
        const deletedBook = await prisma.books.delete({
            where: { id },
        });
        res.status(200).json({
            message: "Book deleted successfully!",
            data: deletedBook,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to delete book" });
    }
};

const searchBooksByName = async (req, res) => {
    try {
        const { search } = req.query;

        const books = await prisma.books.findMany({
            where: {
                title: {
                    contains: search,
                },
            },
        });

        if (books.length === 0) {
            return res.status(200).json({ message: "No Books found" });
        }

        return res.status(200).json({ books });
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};

module.exports = {
    createBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook,
    searchBooksByName,
};
