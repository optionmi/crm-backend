const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

// Create an instance of the Prisma Client
const prisma = new PrismaClient();

const router = express.Router();

// Login route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await prisma.users.findUnique({
            where: { email },
            include: { admin: true, publishers: true, salespeople: true },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Create and sign a JSON Web Token
        const payload = { user: { id: user.id, user_type: user.user_type } };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: "1d" },
            (error, token) => {
                if (error) throw error;

                // Check if the user_type is "Salesperson"
                if (user.user_type === "salesperson") {
                    // Fetch the salesperson's team and include it in the response
                    prisma.salespeople
                        .findUnique({
                            where: {
                                user_id: user.id,
                            },
                        })
                        .then((salesperson) => {
                            if (salesperson) {
                                res.json({
                                    message: "Logged in successfully",
                                    token,
                                    id: user.id,
                                    name: user.name,
                                    // user.admin?.name ||
                                    // user.publishers?.name ||
                                    // user.salespeople?.name ||
                                    // "Unknown",
                                    email: user.email,
                                    user_type: user.user_type,
                                    team: salesperson.team,
                                    id:user.id
                                });
                            } else {
                                res.status(401).send("Access Denied");
                            }
                        })
                        .catch((error) => {
                            // Handle errors
                            console.error(error);
                            res.status(500).send("Internal Server Error");
                        });
                } else {
                    // For other user types, send the token and user_type only
                    res.json({
                        message: "Logged in successfully",
                        token,
                        id: user.id,
                        name: user.name,
                        // user.admin?.name ||
                        // user.publishers?.name ||
                        // user.salespeople?.name ||
                        // "Unknown",
                        email: user.email,
                        user_type: user.user_type,
                        id:user.id
                    });
                }
            }
        );
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
