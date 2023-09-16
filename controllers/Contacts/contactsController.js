const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createContact = async (req, res) => {
    const { name, email, phone_number, team, password } = req.body;

    try {
        const existingUser = await prisma.users.findUnique({
            where: { email },
        });
        if (existingUser) {
            res.status(400).json({
                message: "User with this email already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 11);

        let creatorId = null;

        if (req.user.user_type === "publisher") {
            const publisher = await publisher.findOne({
                where: { user_id: req.user.id },
            });
            if (publisher) {
                creatorId = publisher.id;
            }
        }

        const user = await prisma.users.create({
            data: {
                email,
                password: hashedPassword,
                user_type: "contact",
            },
        });

        if (!user || !user.id) {
            res.status(500).json({ message: "User creation failed" });
        }

        const contact = await prisma.contacts.create({
            data: {
                user_id: user.id,
                name,
                email,
                phone_number,
                team,
                publisher_id: creatorId,
            },
        });

        res.status(201).json(contact);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    }
};

const getContactById = async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        res.status(400).send({ message: "Invalid ID" });
    }

    try {
        const contact = await prisma.contacts.findUnique({
            where: { id },
        });

        if (contact) {
            res.status(200).json(contact);
        } else {
            res.status(404).json({ message: "Contact not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

const getAllContacts = async (req, res) => {
    try {
        const contacts = await prisma.contacts.findMany();

        if (contacts.length > 0) {
            res.status(200).json(contacts);
        } else {
            res.status(404).json({ message: "No contacts found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

const searchContactsByName = async (req, res) => {
    try {
        const { name } = req.query;

        const contacts = await prisma.contacts.findMany({
            where: {
                name: {
                    contains: name,
                },
            },
            include: { contact_numbers: true, emails: true },
        });

        if (contacts.length === 0) {
            res.status(404).json({ message: "No contacts found" });
        }

        res.status(200).json(contacts);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};

module.exports = {
    createContact,
    getContactById,
    getAllContacts,
    searchContactsByName,
};
