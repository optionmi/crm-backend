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
            lead_contact_person_id,
            organization_id,
            lead_products,
        } = req.body;

        const date = new Date(expected_close_date);
        let expected_close_date_formatted = date.toISOString();

        const total_amount = lead_products.reduce(
            (total, product) => total + product.price * product.quantity,
            0
        );
        if (!parseInt(salesperson_id)) {
            return res.status(400).json({ message: "Invalid Sales Owner" });
        } else {
            const salesOwnerCheck = await prisma.salespeople.findUnique({
                where: { id: parseInt(salesperson_id) },
            });
            if (!salesOwnerCheck) {
                return res.status(400).json({ message: "Invalid Sales Owner" });
            }
        }
        // contact person check
        if (!parseInt(lead_contact_person_id)) {
            return res.status(400).json({ message: "Invalid Contact Person" });
        } else {
            const contactPersonCheck = await prisma.contacts.findUnique({
                where: { id: parseInt(lead_contact_person_id) },
            });
            if (!contactPersonCheck) {
                return res
                    .status(400)
                    .json({ message: "Invalid Contact Person" });
            }
        }

        // lead products
        const lead_products_formatted = lead_products.map((product) => {
            if (product.book_id === null) return null;
            return {
                book: { connect: { id: product.book_id } },
                price: parseFloat(product.price),
                quantity: parseInt(product.quantity),
            };
        });

        leadData = {
            client_name,
            requirement,
            budget,
            source,
            type,
            expected_close_date: expected_close_date_formatted,
            stage,
            total_amount: parseFloat(total_amount.toFixed(2)),
            salesperson: {
                connect: { id: salesperson_id },
            },
            lead_contact_person: {
                create: {
                    contact: { connect: { id: lead_contact_person_id } },
                    organization: { connect: { id: organization_id } },
                },
            },
        };
        if (
            lead_products_formatted.length > 0 &&
            lead_products_formatted[0] !== null
        ) {
            leadData.lead_products = {
                create: [...lead_products_formatted],
            };
        }
        // Create the lead
        const lead = await prisma.leads.create({
            data: leadData,
        });
        return res.status(201).json({
            message: "Lead created successfully!",
            data: lead,
        });
        // } else {
        //     return res.status(403).json({ message: "Permission denied" });
        // }
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
                lead_contact_person: {
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
                lead_products: true,
                salesperson: true,
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
                lead_contact_person: {
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
                lead_products: { include: { book: true } },
                salesperson: true,
                lead_notes: {
                    include: {
                        user: { select: { email: true, name: true } },
                    },
                },
                lead_files: {
                    include: {
                        user: { select: { email: true, name: true } },
                    },
                },
                lead_activities: {
                    include: {
                        user: { select: { email: true, name: true } },
                        participants: {
                            include: {
                                user: { select: { email: true, name: true } },
                                contact: true,
                            },
                        },
                    },
                },
                lead_emails: { include: { user: true } },
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
        lead_contact_person_id,
        // organization_id,
        lead_products,
        // contact_id,
        lead_contact_person,
    } = req.body;

    try {
        const lead = await prisma.leads.findUnique({ where: { id: leadId } });
        const contact_id = lead_contact_person.contact.id;
        const organization_id = lead_contact_person.contact.organization_id;

        if (!lead) {
            return res.status(404).json({ message: "Lead not found" });
        }

        const date = new Date(expected_close_date);
        let expected_close_date_formatted = date.toISOString();

        const total_amount = lead_products.reduce(
            (total, product) => total + product.price * product.quantity,
            0
        );
        if (!parseInt(salesperson_id)) {
            return res.status(400).json({ message: "Invalid Sales Owner" });
        } else {
            const salesOwnerCheck = await prisma.salespeople.findUnique({
                where: { id: parseInt(salesperson_id) },
            });
            if (!salesOwnerCheck) {
                return res.status(400).json({ message: "Invalid Sales Owner" });
            }
        }
        // contact person check
        if (!parseInt(contact_id)) {
            return res.status(400).json({ message: "Invalid Contact Person" });
        } else {
            const contactPersonCheck = await prisma.contacts.findUnique({
                where: { id: parseInt(contact_id) },
            });
            if (!contactPersonCheck) {
                return res.status(400).json({
                    message: "Invalid Contact Person, Contact not found",
                });
            }
        }

        // lead products
        if (lead_products.length > 0) {
            const lead_products_update = lead_products.map(async (product) => {
                if (product.id) {
                    const updated_product = await prisma.lead_products.update({
                        where: { id: product.id },
                        data: {
                            book: { connect: { id: product.book_id } },
                            price: parseFloat(product.price),
                            quantity: parseInt(product.quantity),
                        },
                    });
                } else {
                    const created_product = await prisma.lead_products.create({
                        data: {
                            book: { connect: { id: product.book_id } },
                            price: parseFloat(product.price),
                            quantity: parseInt(product.quantity),
                            lead: { connect: { id: leadId } },
                        },
                    });
                }
            });
        } else {
            // delete all lead products
            await prisma.lead_products.deleteMany({
                where: { lead_id: leadId },
            });
        }

        leadData = {
            client_name,
            requirement,
            budget,
            source,
            type,
            expected_close_date: expected_close_date_formatted,
            stage,
            total_amount: parseFloat(total_amount.toFixed(2)),
            salesperson: {
                connect: { id: salesperson_id },
            },
            lead_contact_person: {
                update: {
                    contact: { connect: { id: contact_id } },
                    organization: { connect: { id: organization_id } },
                },
            },
            lead_emails: { include: { user: true } },
        };
        // if (
        //     lead_products_formatted.length > 0 &&
        //     lead_products_formatted[0] !== null
        // ) {
        //     leadData.lead_products = {
        //         update: {where:,data:[...lead_products_formatted]},
        //     };
        // }

        const updatedLead = await prisma.leads.update({
            where: { id: leadId },
            data: leadData,
        });

        return res.status(200).json({
            message: "Lead updated successfully!",
            data: updatedLead,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

// Function to add notes in a lead
const addNote = async (req, res) => {
    const leadId = parseInt(req.params.id);
    if (isNaN(leadId)) {
        return res.status(400).json({ message: "Invalid ID" });
    }
    const { note } = req.body;
    const user_id = req.user.id;

    try {
        const lead = await prisma.lead_notes.create({
            data: {
                note,
                lead: { connect: { id: leadId } },
                user: { connect: { id: user_id } },
            },
            include: {
                user: true,
            },
        });
        return res
            .status(201)
            .json({ message: "Note Added successfully!", ...lead });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

// Function to update lead's stage
const updateLeadStage = async (req, res) => {
    const leadId = parseInt(req.params.id);
    if (isNaN(leadId)) {
        return res.status(400).json({ message: "Invalid ID" });
    }
    const { stage, won_value, lost_reason, closed_date } = req.body;

    try {
        const lead = await prisma.leads.update({
            where: { id: leadId },
            data: { stage, won_value, lost_reason, closed_date },
            include: {
                lead_contact_person: {
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
                lead_products: { include: { book: true } },
                salesperson: true,
                lead_notes: {
                    include: {
                        user: { select: { email: true, name: true } },
                    },
                },
                lead_files: {
                    include: {
                        user: { select: { email: true, name: true } },
                    },
                },
                lead_activities: {
                    include: {
                        user: { select: { email: true, name: true } },
                        participants: {
                            include: {
                                user: { select: { email: true, name: true } },
                                contact: true,
                            },
                        },
                    },
                },
                lead_emails: { include: { user: true } },
            },
        });
        return res
            .status(200)
            .json({ message: "Lead updated successfully!", ...lead });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

const addFile = async (req, res) => {
    const leadId = parseInt(req.params.id);
    if (isNaN(leadId)) {
        return res.status(400).json({ message: "Invalid ID" });
    }
    const { name, description, file } = req.body;
    const user_id = req.user.id;
    const file_name = req.file.filename;

    try {
        // Save the file to "files/lead/"

        // Create the lead
        const lead = await prisma.lead_files.create({
            data: {
                name,
                description,
                file_name,
                lead: { connect: { id: leadId } },
                user: { connect: { id: user_id } },
            },
            include: {
                user: true,
            },
        });

        return res
            .status(201)
            .json({ message: "File Added successfully!", ...lead });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

const addActivity = async (req, res) => {
    const leadId = parseInt(req.params.id);
    if (isNaN(leadId)) {
        return res.status(400).json({ message: "Invalid ID" });
    }
    const {
        title,
        type,
        location,
        description,
        dt_from,
        dt_to,
        contact_ids,
        user_ids,
    } = req.body;
    const user_id = req.user.id;

    try {
        const lead = await prisma.lead_activities.create({
            data: {
                title,
                type,
                location,
                description,
                dt_from: new Date(dt_from).toISOString(),
                dt_to: new Date(dt_to).toISOString(),
                lead: { connect: { id: leadId } },
                user: { connect: { id: user_id } },
            },
            include: {
                user: true,
            },
        });
        return res
            .status(201)
            .json({ message: "Activity Added successfully!", ...lead });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

module.exports = {
    createLead,
    getAllLeads,
    getLeadById,
    updateLeadById,
    addNote,
    addFile,
    updateLeadStage,
    addActivity,
};
