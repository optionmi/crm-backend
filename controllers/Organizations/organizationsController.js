const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createOrganization = async (req, res) => {
    const { name, address, country, state, city, postal_code } = req.body;

    try {
        const organization = await prisma.organizations.create({
            data: {
                name,
                address,
                country,
                state,
                city,
                postal_code: parseInt(postal_code),
            },
        });
        return res.status(201).json({
            message: "Organization created successfully!",
            ...organization,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

const getAllOrganizations = async (req, res) => {
    try {
        const organizations = await prisma.organizations.findMany({
            include: {
                _count: {
                    select: { contacts: true },
                },
            },
        });
        return res.status(200).json({ organizations });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

const deleteOrganizationById = async (req, res) => {
    try {
        const { id } = req.params;

        // const result = await prisma.$transaction([
        //     prisma.organization_items.deleteMany({
        //         where: {
        //             organization_id: parseInt(id),
        //         },
        //     }),
        //     prisma.organizations.delete({
        //         where: {
        //             id: parseInt(id),
        //         },
        //     }),
        // ]);

        const organization_deletion = await prisma.organizations.delete({
            where: {
                id: parseInt(id),
            },
        });

        return res.status(200).json({
            message: "Organization deleted successfully!",
            ...organization_deletion,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

const getOrganizationById = async (req, res) => {
    try {
        const { id } = req.params;
        const organization = await prisma.organizations.findUnique({
            where: { id: parseInt(id) },
        });
        return res
            .status(200)
            .json({ message: "Organization found", ...organization });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

const updateOrganizationById = async (req, res) => {
    const { id } = req.params;
    const { name, address, country, state, city, postal_code } = req.body;

    try {
        const organization = await prisma.organizations.update({
            where: {
                id: parseInt(id),
            },
            data: {
                name,
                address,
                country,
                state,
                city,
                postal_code: parseInt(postal_code),
            },
        });
        return res.status(200).json({
            message: "Organization Updated successfully!",
            ...organization,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

const searchOrganizations = async (req, res) => {
    try {
        const { search } = req.query;

        const organizations = await prisma.organizations.findMany({
            where: {
                name: {
                    contains: search,
                },
            },
        });

        if (organizations.length === 0) {
            return res.status(200).json({ message: "No Organizations found" });
        }

        return res.status(200).json({ organizations });
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
};

module.exports = {
    createOrganization,
    getAllOrganizations,
    deleteOrganizationById,
    getOrganizationById,
    updateOrganizationById,
    searchOrganizations,
};
