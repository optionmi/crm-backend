const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createQuote = async (req, res) => {
    const {
        salesperson_id,
        subject,
        description,
        expired_at,
        contact_person_id,
        lead_id,
        billing_address,
        billing_country,
        billing_state,
        billing_city,
        billing_postal_code,
        shipping_address,
        shipping_country,
        shipping_state,
        shipping_city,
        shipping_postal_code,
        sub_total,
        total_discount,
        total_tax,
        adjustment,
        grand_total,
        quote_items,
    } = req.body;

    const formatted_quote_items = quote_items.map((item) => {
        return {
            book_id: parseInt(item.book_id),
            quantity: parseInt(item.quantity),
            price: parseFloat(item.price.toFixed(2)),
            amount: parseFloat(item.amount), //.toFixed(2)),
            discount: parseFloat(item.discount),
            tax: parseFloat(item.tax),
            total: parseFloat(item.total), //.toFixed(2)),
        };
    });

    try {
        const quote = await prisma.quotes.create({
            data: {
                salesperson_id,
                subject,
                description,
                expired_at: new Date(expired_at).toISOString(),
                contact_person_id,
                lead_id,
                billing_address,
                billing_country,
                billing_state,
                billing_city,
                billing_postal_code: parseInt(billing_postal_code),
                shipping_address,
                shipping_country,
                shipping_state,
                shipping_city,
                shipping_postal_code: parseInt(shipping_postal_code),
                sub_total: parseFloat(sub_total.toFixed(2)),
                total_discount: parseFloat(total_discount.toFixed(2)),
                total_tax: parseFloat(total_tax.toFixed(2)),
                adjustment: parseFloat(adjustment),
                grand_total: parseFloat(grand_total.toFixed(2)),
                quote_items: {
                    create: formatted_quote_items,
                },
            },
        });
        return res
            .status(201)
            .json({ message: "Quote created successfully!", ...quote });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

const getAllQuotes = async (req, res) => {
    try {
        const quotes = await prisma.quotes.findMany({
            include: {
                salesperson: true,
                contact: true,
            },
        });
        return res.status(200).json({ quotes });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

const deleteQuoteById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await prisma.$transaction([
            prisma.quote_items.deleteMany({
                where: {
                    quote_id: parseInt(id),
                },
            }),
            prisma.quotes.delete({
                where: {
                    id: parseInt(id),
                },
            }),
        ]);

        return res
            .status(200)
            .json({ message: "Quote deleted successfully!", ...result });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

const getQuoteById = async (req, res) => {
    try {
        const { id } = req.params;
        const quote = await prisma.quotes.findUnique({
            where: { id: parseInt(id) },
            include: {
                quote_items: { include: { book: true } },
                salesperson: true,
                contact: true,
                lead: true,
            },
        });
        return res.status(200).json({ message: "Quote found", ...quote });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

const updateQuoteById = async (req, res) => {
    const { id } = req.params;
    const {
        salesperson_id,
        subject,
        description,
        expired_at,
        contact_person_id,
        lead_id,
        billing_address,
        billing_country,
        billing_state,
        billing_city,
        billing_postal_code,
        shipping_address,
        shipping_country,
        shipping_state,
        shipping_city,
        shipping_postal_code,
        sub_total,
        total_discount,
        total_tax,
        adjustment,
        grand_total,
        quote_items,
        removed_items,
    } = req.body;

    // quote items
    if (quote_items.length > 0) {
        const quote_items_update = quote_items.map(async (item) => {
            if (item.id) {
                const updated_item = await prisma.quote_items.update({
                    where: { id: item.id },
                    data: {
                        book_id: parseInt(item.book_id),
                        quantity: parseInt(item.quantity),
                        price: parseFloat(item.price),
                        amount: parseFloat(item.amount),
                        discount: parseFloat(item.discount),
                        tax: parseFloat(item.tax),
                        total: parseFloat(item.total),
                    },
                });
            } else {
                const created_item = await prisma.quote_items.create({
                    data: {
                        book_id: parseInt(item.book_id),
                        quantity: parseInt(item.quantity),
                        price: parseFloat(item.price),
                        amount: parseFloat(item.amount),
                        discount: parseFloat(item.discount),
                        tax: parseFloat(item.tax),
                        total: parseFloat(item.total),
                    },
                });
            }
        });
    } else {
        // delete all quote items
        await prisma.quote_items.deleteMany({
            where: { quote_id: id },
        });
    }
    if (removed_items?.length > 0) {
        await prisma.quote_items.deleteMany({
            where: { id: { in: removed_items } },
        });
    }

    try {
        const quote = await prisma.quotes.update({
            where: {
                id: parseInt(id),
            },
            data: {
                salesperson_id,
                subject,
                description,
                expired_at: new Date(expired_at).toISOString(),
                contact_person_id,
                lead_id,
                billing_address,
                billing_country,
                billing_state,
                billing_city,
                billing_postal_code: parseInt(billing_postal_code),
                shipping_address,
                shipping_country,
                shipping_state,
                shipping_city,
                shipping_postal_code: parseInt(shipping_postal_code),
                sub_total: parseFloat(sub_total.toFixed(2)),
                total_discount: parseFloat(total_discount.toFixed(2)),
                total_tax: parseFloat(total_tax.toFixed(2)),
                adjustment: parseFloat(adjustment),
                grand_total: parseFloat(grand_total.toFixed(2)),
                // quote_items: {
                //     create: formatted_quote_items,
                // },
            },
        });
        return res
            .status(200)
            .json({ message: "Quote Updated successfully!", ...quote });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createQuote,
    getAllQuotes,
    deleteQuoteById,
    getQuoteById,
    updateQuoteById,
};
