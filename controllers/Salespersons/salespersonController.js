const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new salesperson
const createSalesperson = async (req, res) => {
    // Check if the user is authorized (admin or publisher)
    if (req.user.user_type !== "admin" && req.user.user_type !== "publisher") {
        return res.status(403).json({ message: "Permission denied" });
    }

    // Extract salesperson data from the request body
    const { name, email, phone_number, team, password } = req.body;

    try {
        // Check if a user with the same email already exists
        // const existingUser = await User.findOne({ where: { email } });
        const existingUser = await prisma.users.findUnique({
            where: { email: email },
        });
        if (existingUser) {
            return res
                .status(400)
                .json({ message: "User with this email already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 11);

        var creatorId = null;

        if (req.user.user_type === "publisher") {
            const publisher = await publisher.findOne({
                where: { user_id: req.user.id },
            });
            if (publisher) {
                creatorId = publisher.id;
            }
        }

        // Create the user in the Users table
        // const user = await User.create({
        const user = await prisma.users.create({
            data: {
                email: email,
                password: hashedPassword,
                user_type: "salesperson",
            },
        });

        if (!user || !user.id) {
            return res.status(500).json({ message: "User creation failed" });
        }

        console.log(creatorId);

        // Create the salesperson
        // const salesperson = await Salesperson.create({
        const salesperson = await prisma.salespeople.create({
            data: {
                user_id: user.id,
                name,
                email,
                phone_number,
                team,
                publisher_id: creatorId,
            },
        });

        return res.status(201).json(salesperson);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Server Error" });
    }
};

// Function to fetch a salesperson by ID (accessible to admin and publisher)
const getSalespersonById = async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        res.status(400).send({ message: "Invalid ID" });
        return;
    }

    try {
        // Check if the user is an admin or publisher
        if (
            req.user.user_type !== "admin" &&
            req.user.user_type !== "publisher"
        ) {
            return res.status(403).json({ message: "Permission denied" });
        }

        // Fetch the salesperson by ID
        // const salesperson = await Salesperson.findByPk(id);
        const salesperson = await prisma.salespeople.findUnique({
            where: { id: id },
        });

        if (salesperson) {
            return res.status(200).json(salesperson);
        } else {
            return res.status(404).json({ message: "Salesperson not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

// Function to fetch all salespersons (accessible to admin and publisher)
const getAllSalespersons = async (req, res) => {
    try {
        const { user_type } = req.user;

        // Check if the user is an admin or publisher
        if (user_type !== "admin" && user_type !== "publisher") {
            return res.status(403).json({ message: "Permission denied" });
        }

        const salespersons = await prisma.salespeople.findMany();

        if (salespersons.length > 0) {
            return res.status(200).json(salespersons);
        } else {
            return res.status(404).json({ message: "No salespersons found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

const searchSalespersonsByName = async (req, res) => {
    try {
        const { search } = req.query;

        const salespersons = await prisma.salespeople.findMany({
            where: {
                name: {
                    contains: search,
                },
            },
        });

        if (salespersons.length === 0) {
            return res.status(200).json({ message: "No salespersons found" });
        }

        return res.status(200).json({ salespersons });
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};

const searchSalespersonsByTeam = async (req, res) => {
    try {
        const salespersons = await prisma.salespeople.findMany({
            where: {
                team: "SalesTeam",
            },
        });

        if (salespersons.length === 0) {
            return res.status(200).json({ message: "No salespersons found" });
        }

        return res.status(200).json({ salespersons });
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};

const updateSalespersonById = async (req, res) => {
    const salespersonId = parseInt(req.params.id);
    if (isNaN(salespersonId)) {
        res.status(400).send({ message: "Invalid ID" });
        return;
    }
    const { name, email, phone_number, team } = req.body;

    try {
        const updatedSalesperson = await prisma.salespeople.update({
            where: {
                id: salespersonId,
            },
            data: {
                name,
                email,
                phone_number,
                team,
            },
        });

        return res.status(200).json(updatedSalesperson);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server Error");
    }
};

const deleteSalespersonById = async (req, res) => {
    const salespersonId = parseInt(req.params.id);
    if (isNaN(salespersonId)) {
        res.status(400).send({ message: "Invalid ID" });
        return;
    }

    try {
        await prisma.salespeople.delete({
            where: {
                id: salespersonId,
            },
        });

        return res.status(200).json({
            message: "Salesperson deleted successfully",
            ...salesperson,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server Error");
    }
};

module.exports = {
    createSalesperson,
    getSalespersonById,
    getAllSalespersons,
    searchSalespersonsByName,
    updateSalespersonById,
    deleteSalespersonById,
    searchSalespersonsByTeam,
};
