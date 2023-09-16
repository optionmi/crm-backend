// const Attendance = require('../../models/Salespersons/attendance');
// const Salespeople = require('../../models/Salespersons/salesperson');
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Function to create attendance
const createAttendance = async (req, res) => {
    try {
        const { is_present } = req.body;

        // Check if the user is in the 'SalesTeam'
        // const user = await Salespeople.findOne({
        //     where: { user_id: req.user.id, team: "SalesTeam" },
        // });
        const user = await prisma.salespeople.findFirst({
            where: { user_id: req.user.id, team: "SalesTeam" },
        });

        if (user) {
            // Create the attendance record
            // const attendance = await Attendance.create({
            //     salesperson_id: user.id,
            //     is_present,
            // });
            const attendance = await prisma.attendance.create({
                data: {
                    salesperson_id: user.id,
                    is_present,
                    date: new Date(),
                },
            });
            return res.status(201).json(attendance);
        } else {
            return res.status(403).json({ message: "Permission denied" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

// Function to get attendance by salesperson_id
const getAttendance = async (req, res) => {
    try {
        // const { salespersonId } = req.params;

        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).send({ message: "Invalid ID" });
            return;
        }

        // Check if the user is in the 'SalesTeam'
        // const user = await Salespeople.findOne({
        //     where: { id: salespersonId, team: "SalesTeam" },
        // });
        const user = await prisma.salespeople.findUnique({
            where: { id, team: "SalesTeam" },
        });

        if (user) {
            // Retrieve attendance records by salesperson_id
            // const attendance = await Attendance.findAll({
            //     where: { salesperson_id: salespersonId },
            // });
            const attendance = await prisma.attendance.findMany({
                where: { salesperson_id: id },
            });

            return res.status(200).json({ attendance });
        } else {
            return res.status(403).json({ message: "Permission denied" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { createAttendance, getAttendance };
