# CRM Backend App README

This repository contains the backend code for a Customer Relationship Management (CRM) application. The CRM backend is built using Node.js, Express.js, Prisma for database management, and JWT for authentication.

## Getting Started

Follow the instructions below to set up and run the CRM backend application.

### Prerequisites

-   Node.js: Make sure you have Node.js installed on your system. You can download it from [nodejs.org](https://nodejs.org/).

### Installation

1. Clone the repository to your local machine using Git:

    ```bash
    git clone https://github.com/optionmi/crm-backend.git
    ```

2. Navigate to the project directory:

    ```bash
    cd crm-backend
    ```

3. Install the required Node modules using either npm or yarn. Choose one of the following commands:

    ```bash
    # Using npm
    npm install

    # Using yarn
    yarn install
    ```

### Configuration

1. Create a `.env` file in the root directory of the project with the following environment variables:

    ```env
    JWT_SECRET=<your-secret-key>
    # DATABASE_URL="mysql://johndoe:randompassword@localhost:3306/mydb"
    # For mysql db at localhost using default credentials: mysql://root:@localhost:3306/crm
    DATABASE_URL=<your-database-url>
    ```

    - `JWT_SECRET`: This is the secret key used to sign and verify JSON Web Tokens (JWTs) for authentication. Replace `<your-secret-key>` with your own secret key.

    - `DATABASE_URL`: This is the connection URL for your Prisma database. Replace `<your-database-url>` with your database URL.

### Database Migration

1. Run Prisma database migration to apply the database schema changes:

    ```bash
    npx prisma migrate dev --name init
    ```

### Seed Database

1. Seed the database with initial data by running the following command:

    ```bash
    npm run seed
    ```

### Starting the Server

1. Start the CRM backend server:

    ```bash
    npm run dev
    ```

    The server should now be running at `http://localhost:8000`.
