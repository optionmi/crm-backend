const bcrypt = require("bcrypt");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedDatabase() {
    try {
        // if (false) {
        // Seed Users
        if (
            !(await prisma.users.findUnique({
                where: { email: "admin@example.com" },
            }))
        ) {
            const admin = await prisma.users.create({
                data: {
                    email: "admin@example.com",
                    password: await bcrypt.hash("password", 11),
                    user_type: "admin",
                    name: "admin",
                    admin: {
                        create: {},
                    },
                },
            });
        }
        if (
            !(await prisma.users.findUnique({
                where: { email: "publisher@example.com" },
            }))
        ) {
            const publisher = await prisma.users.create({
                data: {
                    email: "publisher@example.com",
                    password: await bcrypt.hash("password", 11),
                    user_type: "publisher",
                    name: "publisher",
                    publishers: {
                        create: {
                            company_name: "abc",
                            email: "publisher@example.com",
                            address: "123 xyz",
                            contact_person: "John Doe",
                            phone_number: 1234567890,
                            country: "USA",
                            state: "CA",
                            city: "San Francisco",
                            postal_code: 12345,
                        },
                    },
                },
            });
        }
        if (
            !(await prisma.users.findUnique({
                where: { email: "salesperson@example.com" },
            }))
        ) {
            const salesperson = await prisma.users.create({
                data: {
                    email: "salesperson@example.com",
                    password: await bcrypt.hash("password", 11),
                    user_type: "salesperson",
                    name: "salesperson",
                    salespeople: {
                        create: {
                            name: "salesperson",
                            publisher_id: 1,
                            email: "salesperson@example.com",
                            phone_number: 1234567890,
                            team: "SalesTeam",
                        },
                    },
                },
            });
        }

        // Seed Boards
        const boards = await prisma.boards.createMany({
            data: [{ name: "ALL" }, { name: "CBSE" }, { name: "ICSE" }],
        });

        // Seed Subjects
        const subjects = await prisma.subjects.createMany({
            data: [{ name: "Hindi" }, { name: "English" }, { name: "Science" }],
        });

        // Seed Series
        const series = await prisma.series.createMany({
            data: [
                { name: "Hindi Series 1", subject_id: 1 },
                { name: "Hindi Series 2", subject_id: 1 },
                { name: "English Series 1", subject_id: 2 },
                { name: "English Series 2", subject_id: 2 },
                { name: "Science Series 1", subject_id: 3 },
                { name: "Science Series 2", subject_id: 3 },
            ],
        });

        // Seed Books
        const books = await prisma.books.createMany({
            data: [
                {
                    title: "Hindi Series 1 Class 1",
                    subject_id: 1,
                    series_id: 1,
                    board_id: 2,
                    price: 99.99,
                    standard: "Class 1",
                },
                {
                    title: "Hindi Series 1 Class 2",
                    subject_id: 1,
                    series_id: 1,
                    board_id: 2,
                    price: 99.99,
                    standard: "Class 2",
                },
                {
                    title: "Hindi Series 2 Class 1",
                    subject_id: 1,
                    series_id: 2,
                    board_id: 2,
                    price: 99.99,
                    standard: "Class 1",
                },
                {
                    title: "Hindi Series 2 Class 2",
                    subject_id: 1,
                    series_id: 2,
                    board_id: 2,
                    price: 99.99,
                    standard: "Class 2",
                },
                {
                    title: "English Series 1 Class 1",
                    subject_id: 2,
                    series_id: 3,
                    board_id: 2,
                    price: 99.99,
                    standard: "Class 1",
                },
                {
                    title: "English Series 1 Class 2",
                    subject_id: 2,
                    series_id: 3,
                    board_id: 2,
                    price: 99.99,
                    standard: "Class 2",
                },
                {
                    title: "English Series 2 Class 1",
                    subject_id: 2,
                    series_id: 4,
                    board_id: 2,
                    price: 99.99,
                    standard: "Class 1",
                },
                {
                    title: "English Series 2 Class 2",
                    subject_id: 2,
                    series_id: 4,
                    board_id: 2,
                    price: 99.99,
                    standard: "Class 2",
                },
                {
                    title: "Science Series 1 Class 1",
                    subject_id: 3,
                    series_id: 5,
                    board_id: 2,
                    price: 99.99,
                    standard: "Class 1",
                },
                {
                    title: "Science Series 1 Class 2",
                    subject_id: 3,
                    series_id: 5,
                    board_id: 2,
                    price: 99.99,
                    standard: "Class 2",
                },
                {
                    title: "Science Series 2 Class 1",
                    subject_id: 3,
                    series_id: 6,
                    board_id: 2,
                    price: 99.99,
                    standard: "Class 1",
                },
                {
                    title: "Science Series 2 Class 2",
                    subject_id: 3,
                    series_id: 6,
                    board_id: 2,
                    price: 99.99,
                    standard: "Class 2",
                },
            ],
        });
        // }
        // Seed Contacts
        const contact = await prisma.contacts.create({
            data: {
                name: "client",
                emails: { create: { email: "client@example.com" } },
                contact_numbers: {
                    create: { number: "1234567890" },
                },
                organization: {
                    create: {
                        name: "abc org",
                        address: "123 xyz",
                        country: "IN",
                        state: "DL",
                        city: "Delhi",
                        postal_code: 123456,
                    },
                },
            },
        });

        // Seed Organizations
        // const organization = await prisma.organizations.create({
        //     data: {
        //         name: "abc org",
        //         address: "123 xyz",
        //         country: "IN",
        //         state: "DL",
        //         city: "Delhi",
        //         postal_code: 123456,
        //     },
        // });
    } catch (error) {
        console.error("Error seeding database:", error);
        return;
    }
    await prisma.$disconnect();
}

seedDatabase();
