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
        // Check if the user is an admin
        if (req.user.user_type !== "admin") {
            return res.status(403).json({ message: "Permission denied" });
        }

        // Check if a user with the same email already exists
        const existingUser = await prisma.users.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res
                .status(400)
                .json({ message: "User with this email already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 11);

        const user = await prisma.users.create({
            data: {
                email,
                password: hashedPassword,
                user_type: "publisher",
            },
        });

        if (!user || !user.id) {
            return res.status(500).json({ message: "User creation failed" });
        }

        const publisher = await prisma.create({
            data: {
                user_id: user.id,
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

        res.status(201).json(publisher);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
};

const getPublisherData = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).send({ message: "Invalid ID" });
            return;
        }

        const publisher = await prisma.publishers.findUnique({
            where: { id },
        });

        if (publisher) {
            return res.status(200).json(publisher);
        } else {
            return res
                .status(404)
                .json({ message: "Publisher data not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

const getAllPublishers = async (req, res) => {
    try {
        if (req.user.user_type !== "admin") {
            return res.status(403).json({ message: "Permission denied" });
        }

        const publishers = await prisma.publishers.findMany();

        if (publishers.length > 0) {
            return res.status(200).json({ data: publishers });
        } else {
            return res.status(404).json({ message: "No publishers found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

module.exports = { createPublisher, getPublisherData, getAllPublishers };
