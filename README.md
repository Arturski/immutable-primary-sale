# Immutable Primary Sale Backend

This project is a backend API for conducting primary sales on IMX zkEVM, enabling product reservations, authorization, and final sale confirmation. It integrates with the Immutable zkEVM for transaction management, nonce handling, and reliable minting.

## Disclaimer

The sample code provided is for reference purposes only and is not officially supported by Immutable. It has undergone best-effort testing to ensure basic functionality. It is essential that you thoroughly test this sample code in your environment to confirm reliability before deploying it in production. By using this code, you agree to perform due diligence in testing and verifying its suitability for your applications. Immutable disclaims any liability for issues arising from the use of this code.

## Features

- Reservation system for products, with stock management.  
- Multi-phase support with start and end times for different sale stages.  
- Authorization step to validate product availability and lock stock before confirmation.  
- Comprehensive error handling and stock expiration flow.  
- Webhook support for post-sale events (planned).  
- Rich logging using Winston for debugging and error tracking.  

## Deployment on Vercel  

1. **Deploy Github Project Vercel**:  
   - Go to Vercel dashboard, Add Project and link to this repo or your own fork
   - Add Environment Variables for the app from .env.example
   - Add `npx prisma generate && next build` to the build settings, replacing the default
   - Deploy the project

2. **Provision the Database on Vercel**:  
   - Create a Postgres database through Vercel's dashboard.
   - Use the `DATABASE_` prefix as required by your app configuration
   - Connect to the project you just deployed via UI
   - Project and Database are now connected

3. **Setup local environment**:  
   - Install and configure Vercel CLI on your local environment and link it to your account. https://vercel.com/docs/cli
   - Run `vercel link`, go through the step process in order to connect local cli to remote project
   - Run `vercel env pull .env` to pull down the complete set of environemnt variables
   - Your local project can now communicate with the remote database

4. **Configure and Seed the database**:
   - Run `npx prisma db push`, to push the local schema to the remote db
   - Update the `seedData.json` file with the intended product data, ensure the contract address is correct
   - Run `npx prisma db seed`, to push the products and currencies to the database

**Local Setup Instructions**

   1. **Update the local env file to the relevant values:**  
      - Update `.env` with local values such as URLs PORTs
      - Do not change the DATABASE envs

   2. **Update Passport Conifg**:
      - Go to https://hub.immutable.com
      - Configure passport URLs

   2. **Install dependencies**:  
      ```bash  
      yarn  
      ```  

   3. **Install ngrep**:  
      - Use `ngrep` to start a local https service
      - Everyone gets a free static URL for free
      - `ngrok http --url=champion-egret-current.ngrok-free.app 3000`

## Endpoints  

### 1. **GET /products**  
   Retrieves the list of available products.  

   **Example Request**:  
   ```bash  
   curl -X GET https://your-vercel-site.com/api/products  
   ```  

### 2. **POST /quote**  
   Generates a quote for the products in the cart, including total pricing.

   **Example Request**:
   ```bash  
   curl -X POST https://your-vercel-site.com/api/quote -d '{  
     "recipient_address": "0xYourWalletAddress",  
     "products": [{"product_id": 1, "quantity": 1}]  
   }'  
   ```  

### 3. **POST /authorize**  
   Reserves products for purchase and locks the stock for a specified time.  

   **Example Request**:  
   ```bash  
   curl -X POST https://your-vercel-site.com/api/authorize -d '{  
     "recipient_address": "0xYourWalletAddress",  
     "currency": "USDC",  
     "products": [{"product_id": 1, "quantity": 1}]  
   }'  
   ```  

### 4. **POST /confirm**  
   Confirms the purchase and finalizes the sale.  

   **Example Request**:  
   ```bash  
   curl -X POST https://your-vercel-site.com/api/confirm -d '{  
     "reference": "your_reference",  
     "tx_hash": "transaction_hash",  
     "recipient_address": "0xYourWalletAddress",  
     "order": {...}  
   }'  
   ```  

### 5. **POST /expire**  
   Manually triggers the expiration of a reservation, making stock available again.  

   **Example Request**:  
   ```bash  
   curl -X POST https://your-vercel-site.com/api/expire -d '{  
     "reference": "your_reference"  
   }'  
   ```  

## Local Test Scripts  

1. **End-to-End Flow Test**:  
   Tests the full flow from product reservation to confirmation.  

   **To run**:  
   ```bash  
   yarn tsc test/testEndToEnd.ts --outDir ./test/compiled  
   node test/compiled/testEndToEnd.js  
   ```  

2. **Expiration Flow Test**:  
   Simulates the expiration of a reserved product.  

   **To run**:  
   ```bash  
   yarn tsc test/testExpire.ts --outDir ./test/compiled  
   node test/compiled/testExpire.js  
   ```  

## Helpful Links  

For more guidance on deploying Next.js and Prisma with Vercel Postgres, refer to the [Vercel Guide](https://vercel.com/guides/nextjs-prisma-postgres). 

Vercel CLI docs - https://vercel.com/docs/cli

Sort deployment video here https://www.loom.com/share/e0552c5d104d4f0ba66f0987a715aac9 

## Tech Stack  

- **Next.js**  
- **Prisma ORM**: For database management and migrations.  
- **Postgres** (hosted on Vercel): For handling product stock and reservations.  
- **Winston**: For logging and debugging.  

## License  

This project is licensed under the terms of the MIT license.  
