const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");

// Import routes
const authRoutes = require("./routes/Auth/auth");
const publisherRoutes = require("./routes/Publishers/publisher");
const salespersonRoutes = require("./routes/Salespersons/salesperson");
const attendanceRoutes = require("./routes/Salespersons/attendance");
const travellingExpenseRoutes = require("./routes/Salespersons/travellingExpense");
const travellingClaimsRoutes = require("./routes/Salespersons/travellingClaims");
const leadsRoutes = require("./routes/Salespersons/leads");
const boardsRoutes = require("./routes/Publishers/boards");
const subjectsRoutes = require("./routes/Publishers/subjects");
const seriesRoutes = require("./routes/Publishers/series");
const booksRoutes = require("./routes/Publishers/books");
const contactsRoutes = require("./routes/Contacts/contacts");
const usersRoutes = require("./routes/Users/users");
const emailRoute = require("./routes/Email/email");
const locationRoutes = require("./routes/Salespersons/location");
const quotesRoutes = require("./routes/Quotes/quotes");
const orgaanizationsRoute = require("./routes/Organizations/organizations");

// Middleware
app.use(express.json());

// Setting up CORS
const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    optionsSuccessStatus: 200,
};

// Use CORS
app.use(cors(corsOptions));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/publishers", publisherRoutes);
app.use("/api/salesperson", salespersonRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/travelling-expense", travellingExpenseRoutes);
app.use("/api/travelling-claims", travellingClaimsRoutes);
app.use("/api/leads", leadsRoutes);
app.use("/api/boards", boardsRoutes);
app.use("/api/subjects", subjectsRoutes);
app.use("/api/series", seriesRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/quotes", quotesRoutes);
app.use("/api/organizations", orgaanizationsRoute);
// Email
app.use("/api/emails", emailRoute);

// Download Files
app.get("/files/lead/:fileName", (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, `/files/lead/`, fileName);

    res.download(filePath, (err) => {
        if (err) {
            res.status(404).send("File not found");
        }
    });
});

// Start the server
const PORT = process.env.PORT || 8000;

// Start the server and listen on the specified port
app.listen(PORT, (error) => {
    if (error) {
        console.error(`Failed to start server on port ${PORT}: ${error}`);
    } else {
        console.log(`Server started on port ${PORT}`);
    }
});
