const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createPublisher = async (req, res) => {
    const {
        company_name,
        email,
        address,
        contact_person,
        phone_number,
        country,
        state,
        city,
        postal_code,
        password,
    } = req.body;

    try {
        const existingUser = await prisma.users.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new Error("User with this email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 11);

        const user = await prisma.users.create({
            data: {
                email,
                password: hashedPassword,
                user_type: "publisher",
                publishers: {
                    create: {
                        company_name,
                        email,
                        address,
                        contact_person,
                        phone_number,
                        country,
                        state,
                        city,
                        postal_code,
                    },
                },
            },
        });

        if (!user || !user.id) {
            throw new Error("User creation failed");
        }

        res.status(201).json({
            message: "Publisher created successfully!",
            ...user,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
};

const getPublisherById = async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).send({ message: "Invalid ID" });
    }

    try {
        const publisher = await prisma.publishers.findUnique({
            where: { id },
        });

        if (publisher) {
            return res.status(200).json(publisher);
        }

        return res.status(404).json({ message: "Publisher data not found" });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server Error");
    }
};

const getAllPublishers = async (req, res) => {
    if (req.user.user_type !== "admin") {
        return res.status(403).json({ message: "Permission denied" });
    }

    try {
        const publishers = await prisma.publishers.findMany();

        if (publishers.length > 0) {
            return res.status(200).json({ publishers });
        } else {
            return res.status(404).json({ message: "No publishers found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server Error");
    }
};

const deletePublisherById = async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).send({ message: "Invalid ID" });
    }

    try {
        const deletedPublisher = await prisma.publishers.delete({
            where: {
                id: id,
            },
        });

        const deletedUser = await prisma.users.delete({
            where: { id: deletedPublisher.user_id },
        });

        res.status(200).json({
            message: "Publisher deleted successfully!",
            ...deletedPublisher,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

const updatePublisherById = async (req, res) => {
    const id = parseInt(req.params.id);
    const {
        company_name,
        email,
        address,
        contact_person,
        phone_number,
        country,
        state,
        city,
        postal_code,
    } = req.body;

    try {
        const updatedPublisher = await prisma.publishers.update({
            where: {
                id: id,
            },
            data: {
                company_name,
                email,
                address,
                contact_person,
                phone_number,
                country,
                state,
                city,
                postal_code,
            },
        });

        res.status(200).json({
            message: "Publisher updated successfully!",
            ...updatedPublisher,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

module.exports = {
    createPublisher,
    getPublisherById,
    getAllPublishers,
    updatePublisherById,
    deletePublisherById,
};
