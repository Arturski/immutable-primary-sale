# Immutable Primary Sale Backend

This project is a backend API for conducting primary sales on IMX zkEVM, allowing product reservations, authorization, and final confirmation of sales. It integrates with the Immutable zkEVM for transaction lifecycle management, nonce handling, and reliable minting.

## Disclaimer

The sample code provided is for reference purposes only and is not officially supported by Immutable. It has undergone best effort testing to ensure basic functionality. It is essential that you thoroughly test this sample code in your own environment to confirm its reliability before deploying it in production. By using this code, you agree to perform due diligence in testing and verifying its suitability for your applications. Immutable disclaims any liability for issues arising from the use of this code.

## Features

- Reservation system for products, with stock management.
- Multi-phase support, with start and end times for different sale stages.
- Authorization step to validate product availability and lock the stock before confirmation.
- Comprehensive error handling and stock expiration flow.
- Webhook support for post-sale events (planned).
- Rich logging using Winston for debugging and error tracking.

## Setup Instructions

1. **Copy the example environment file and configure it:**
   ```bash
   cp .env.example .env
   ```

   Ensure you update the `.env` file with your database configuration and API key.

2. **Install the dependencies:**
   ```bash
   yarn
   ```

3. **Update the `config.ts` file:**
   In `src/config.ts`, set up the required parameters.

4. **Update Prisma Configs:**
   In `prisma/seed.ts`, set up the required product and currency parameters.
   Run `yarn tsc prisma/seed.ts --outDir ./prisma/compiled` to compile the script into js. 

4. **Run Prisma migrations:**
   Run `npx prisma migrate dev --name init` to initialise the database.
   For web deployments you will need to deploy and configure Postgres

5. **Seed your database:**
   Use a tool like [DB Browser for SQLite](https://sqlitebrowser.org/) to populate your database, or use the Prisma client to write a script for loading allowlisted addresses.

6. **Start the development server:**
   ```bash
   yarn run dev
   ```

## Endpoints

### 1. **GET /products**
   Retrieves the list of available products.

   **Example Request:**
   ```bash
   curl -X GET http://localhost:3000/api/products
   ```

### 2. **POST /quote**
   Generates a quote for the products in the cart, including total pricing.

   **Example Request:**
   ```bash
   curl -X POST http://localhost:3000/api/quote -d '{
     "recipient_address": "0xYourWalletAddress",
     "products": [{"product_id": 1, "quantity": 1}]
   }'
   ```

### 3. **POST /authorize**
   Reserves products for purchase and locks the stock for a specified time.

   **Example Request:**
   ```bash
   curl -X POST http://localhost:3000/api/authorize -d '{
     "recipient_address": "0xYourWalletAddress",
     "currency": "USDC",
     "products": [{"product_id": 1, "quantity": 1}]
   }'
   ```

### 4. **POST /confirm**
   Confirms the purchase and finalizes the sale.

   **Example Request:**
   ```bash
   curl -X POST http://localhost:3000/api/confirm -d '{
     "reference": "your_reference",
     "tx_hash": "transaction_hash",
     "recipient_address": "0xYourWalletAddress",
     "order": {...}  // Complete order details
   }'
   ```

### 5. **POST /expire**
   Manually triggers the expiration of a reservation, making stock available again.

   **Example Request:**
   ```bash
   curl -X POST http://localhost:3000/api/expire -d '{
     "reference": "your_reference"
   }'
   ```

## Local Test Scripts

1. **End-to-End Flow Test:**
   Tests the full flow from product reservation to confirmation.

   **To run:**
   ```bash
   yarn tsc test/testEndToEnd.ts --outDir ./test/compiled
   node test/testEndToEnd.js
   ```

2. **Expiration Flow Test:**
   Simulates the expiration of a reserved product.

   **To run:**
   ```bash
   yarn tsc test/testExpire.ts --outDir ./test/compiled
   node test/compiled/testExpire.js
   ```

## Frontend
The front end is generic enough to fit any config. It will automatically query the products endpoint. 

## Tech Stack

- **NextJs**: 
- **Prisma ORM**: For database management and migrations.
- **SQLite**: Lightweight relational database for handling product stock and reservations.
- **Winston**: For logging and debugging purposes.

## To-Do List

- [ ] Postgress Vercel guide
- [ ] Running TS files without compiling step
- [ ] Steps for demo


## License

This project is licensed under the terms of the MIT license.
