const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Function to create leads
const createLead = async (req, res) => {
    try {
        const {
            client_name,
            requirement,
            budget,
            source,
            type,
            expected_close_date,
            stage,
            salesperson_id,
            contact_person_id,
            organization_id,
            book_id,
            price,
            quantity,
        } = req.body;

        // Check if the user is in the 'SalesTeam'
        const user = await prisma.salespeople.findFirst({
            where: { user_id: req.user.id, team: "SalesTeam" },
        });

        if (user) {
            // Create the lead
            const lead = await prisma.leads.create({
                data: {
                    client_name,
                    requirement,
                    budget,
                    source,
                    type,
                    expected_close_date,
                    stage,
                    salesperson: {
                        connect: { id: salesperson_id },
                    },
                    leads_contact_person: {
                        create: {
                            contact: { connect: { id: contact_person_id } },
                            organization: { connect: { id: organization_id } },
                        },
                    },
                    leads_products: {
                        create: {
                            book: { connect: { id: book_id } },
                            price,
                            quantity,
                        },
                    },
                },
            });
            return res
                .status(201)
                .json({ message: "Lead Created Successfully!", data: lead });
        } else {
            return res.status(403).json({ message: "Permission denied" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

// Function to get all leads
const getAllLeads = async (req, res) => {
    try {
        const leads = await prisma.leads.findMany({
            include: {
                leads_contact_person: {
                    include: {
                        contact: {
                            include: {
                                emails: true,
                                contact_numbers: true,
                                organization: true,
                            },
                        },
                    },
                },
            },
        });
        return res.status(200).json({ leads });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

const getLeadById = async (req, res) => {
    const leadId = parseInt(req.params.id);

    if (isNaN(leadId)) {
        res.status(400).send({ message: "Invalid ID" });
        return;
    }

    try {
        const lead = await prisma.leads.findUnique({
            where: { id: leadId },
            include: {
                leads_contact_person: {
                    include: {
                        contact: {
                            include: {
                                emails: true,
                                contact_numbers: true,
                                organization: true,
                            },
                        },
                    },
                },
            },
        });

        if (!lead) {
            return res.status(404).json({ message: "Lead not found" });
        }

        return res.status(200).json({ ...lead });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

// Function to update a lead by ID
const updateLeadById = async (req, res) => {
    const leadId = parseInt(req.params.id);

    if (isNaN(leadId)) {
        return res.status(400).json({ message: "Invalid ID" });
    }

    const {
        client_name,
        requirement,
        budget,
        source,
        type,
        expected_close_date,
        stage,
        salesperson_id,
        contact_person_id,
        organization_id,
        book_id,
        price,
        quantity,
    } = req.body;

    try {
        const lead = await prisma.leads.findUnique({ where: { id: leadId } });

        if (!lead) {
            return res.status(404).json({ message: "Lead not found" });
        }

        const updatedLead = await prisma.leads.update({
            where: { id: leadId },
            data: {
                client_name,
                requirement,
                budget,
                source,
                type,
                expected_close_date,
                stage,
                salesperson: {
                    connect: { id: salesperson_id },
                },
                leads_contact_person: {
                    create: {
                        contact: { connect: { id: contact_person_id } },
                        organization: { connect: { id: organization_id } },
                    },
                },
                leads_products: {
                    create: {
                        book: { connect: { id: book_id } },
                        price,
                        quantity,
                    },
                },
            },
        });

        return res
            .status(200)
            .json({ message: "Lead updated successfully", data: updatedLead });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { createLead, getAllLeads, getLeadById, updateLeadById };
