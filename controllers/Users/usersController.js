const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const searchUsers = async (req, res) => {
    const { searchTerm } = req.query;
    try {
        const users = await prisma.users.findMany({
            where: { name: { contains: searchTerm } },
        });

        if (users.length === 0) {
            return res.status(200).json({ message: "No contacts found" });
        }

        return res.status(200).json({ users });
    } catch (error) {
        console.error(error);
        res.send({ message: "Server Error" });
    }
};

module.exports = { searchUsers };
