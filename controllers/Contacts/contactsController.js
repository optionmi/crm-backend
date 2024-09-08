const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createContact = async (req, res) => {
    const { name, emails, contact_numbers, organization_id } = req.body;

    try {
        const contact = await prisma.contacts.create({
            data: {
                name,
                emails: { createMany: { data: emails } },
                contact_numbers: { createMany: { data: contact_numbers } },
                organization: { connect: { id: organization_id } },
            },
        });

        return res.status(201).json({
            message: "Contact created successfully!",
            ...contact,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
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
            include: {
                emails: true,
                contact_numbers: true,
                organization: true,
            },
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
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10; // Default page size
    const skip = (page - 1) * pageSize;

    try {
        const [contacts, totalCount] = await Promise.all([
            prisma.contacts.findMany({
                include: {
                    emails: true,
                    contact_numbers: true,
                    organization: true,
                },
                skip,
                take: pageSize,
            }),
            prisma.contacts.count(),
        ]);

        if (contacts.length > 0) {
            res.status(200).json({ contacts, totalCount });
        } else {
            res.status(404).json({ message: "No contacts found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

const searchContacts = async (req, res) => {
    try {
        const { search } = req.query;

        const contacts = await prisma.contacts.findMany({
            where: {
                name: {
                    contains: search,
                },
            },
            include: {
                contact_numbers: true,
                emails: true,
                organization: true,
            },
        });

        if (contacts.length === 0) {
            return res.status(200).json({ message: "No contacts found" });
        }

        return res.status(200).json({ contacts });
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
};

const updateContactById = async (req, res) => {
    const {
        id,
        name,
        emails,
        contact_numbers,
        organization_id,
        removed_emails,
        removed_contacts,
    } = req.body;

    try {
        // Start a transaction
        const contact = await prisma.$transaction([
            // Update the contact's basic info and organization
            prisma.contacts.update({
                where: { id },
                data: {
                    name,
                    organization: { connect: { id: organization_id } },
                },
            }),
            // Update each email
            ...emails.map((email) =>
                prisma.contact_emails.update({
                    where: { id: email.id },
                    data: { ...email },
                })
            ),
            // Update each contact number
            ...contact_numbers.map((contact_number) =>
                prisma.contact_numbers.update({
                    where: { id: contact_number.id },
                    data: { ...contact_number },
                })
            ),
            // Delete removed emails
            ...(removed_emails && removed_emails.length > 0
                ? removed_emails.map((emailId) =>
                      prisma.contact_emails.delete({
                          where: { id: emailId },
                      })
                  )
                : []),
            // Delete removed contact numbers
            ...(removed_contacts && removed_contacts.length > 0
                ? removed_contacts.map((contactId) =>
                      prisma.contact_numbers.delete({
                          where: { id: contactId },
                      })
                  )
                : []),
        ]);

        return res.status(200).json({
            message: "Contact updated successfully!",
            ...contact,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

const deleteContactByID = async (req, res) => {
    const { id } = req.params;

    try {
        // Start a transaction
        const contact_deletion = await prisma.$transaction([
            // Delete the emails associated with the contact
            prisma.contact_emails.deleteMany({
                where: { contact_id: parseInt(id) },
            }),
            // Delete the contact numbers associated with the contact
            prisma.contact_numbers.deleteMany({
                where: { contact_id: parseInt(id) },
            }),
            // Delete the contact
            prisma.contacts.delete({
                where: { id: parseInt(id) },
            }),
        ]);

        return res.status(200).json({
            message: "Contact Deleted successfully!",
            // ...contact_deletion,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createContact,
    getContactById,
    getAllContacts,
    searchContacts,
    updateContactById,
    deleteContactByID,
};
