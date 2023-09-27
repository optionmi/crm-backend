// const TravellingClaims = require('../../models/Salespersons/travellingClaims');
// const Salespeople = require('../../models/Salespersons/salesperson');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createClaim = async (req, res) => {
    try {
        const { claim_description, amount, claim_date, id } = req.body;
        const user = await prisma.salespeople.findFirst({
            where: { user_id: id },
        });

        if (
            user &&
            ["SalesTeam", "SalesCoordinationTeam", "FinanceTeam"].includes(
                user.team
            )
        ) {
            // const claim = await TravellingClaims.create({
            const claim = await prisma.travellingclaims.create({
                data: {
                    salesperson_id: user.id,
                    claim_description,
                    amount,
                    claim_date: new Date(),
                },
            });

            return res.status(201).json({ claim });
        } else {
            return res.status(403).json({ message: "Permission denied" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

const getAllClaims = async (req, res) => {
    try {
        // const claims = await TravellingClaims.findAll();
        const claims = await prisma.travellingclaims.findMany();
        return res.status(200).json({ claims });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { createClaim, getAllClaims };
