// const TravellingExpenses = require('../../models/Salespersons/travellingExpenses');
// const Salespeople = require('../../models/Salespersons/salesperson');
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createExpense = async (req, res) => {
    try {
        const { expense_description, amount, id } = req.body;

        const user = await prisma.salespeople.findFirst({
            where: { user_id: id },
        });

        const allowedTeams = [
            "SalesTeam",
            "SalesCoordinationTeam",
            "FinanceTeam",
        ];

        if (user && allowedTeams.includes(user.team)) {
            // const expense = await TravellingExpenses.create({
            const expense = await prisma.travellingexpenses.create({
                data: {
                    salesperson_id: user.id,
                    expense_description,
                    amount,
                    expense_date: new Date(),
                },
            });

            return res.status(201).json(expense);
        } else {
            return res.status(403).json({ message: "Permission denied" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

// Function to get all travelling expenses
const getAllExpenses = async (req, res) => {
    try {
        // const expenses = await TravellingExpenses.findAll(); // Retrieve all travelling expenses
        const expenses = await prisma.travellingexpenses.findMany();

        return res.status(200).json({ expenses });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { createExpense, getAllExpenses };
