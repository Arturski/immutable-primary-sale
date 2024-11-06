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

1. **Provision the Database on Vercel**:  
   - Create a Postgres database through Vercel's dashboard.  
   - Copy the database credentials (host, user, password, etc.) and use them in the environment variables.  

2. **Configure Environment Variables**:  
   - Set the following environment variables on Vercel (under **Settings** > **Environment Variables**).  
   - Use the `DATABASE_` prefix as required by your app configuration:  
     ```plaintext  
     DATABASE_URL=postgres://<user>:<password>@<host>/<database>?sslmode=require  
     NEXT_PUBLIC_SANDBOX_IMMUTABLE_PUBLISHABLE_KEY=your_sandbox_immutable_publishable_key  
     NEXT_PUBLIC_SANDBOX_PASSPORT_CLIENT_ID=your_sandbox_passport_client_id  
     NEXT_PUBLIC_SANDBOX_PASSPORT_LOGIN_REDIRECT_URI=https://your-vercel-site.com/redirect  
     NEXT_PUBLIC_SANDBOX_PASSPORT_LOGOUT_REDIRECT_URI=https://your-vercel-site.com/logout  
     NEXT_PUBLIC_HUB_ENVIRONMENT_ID="32aff30c-852e-***"  
     ```  
   - Replace `<user>`, `<password>`, `<host>`, and `<database>` with your actual database credentials.  

3. **Local Setup Instructions**

   1. **Copy the example environment file and configure it:**  
      ```bash  
      cp .env.example .env  
      ```  

      Update `.env` with your Vercel database configuration and API keys.  

   2. **Install dependencies**:  
      ```bash  
      yarn  
      ```  

   3. **Update the `config.ts` file**:  
      Set up the required parameters in `src/config.ts`.  

   4. **Run Prisma migrations**:  
      Push the Prisma schema to Vercel:  
      ```bash  
      npx prisma db push  
      ```  

   5. **Seed the Database**:  
      Before running the seed script, update the `seedData` with the required product and currency data in `prisma/seed.ts`. Then, seed the database:  
      ```bash  
      npx prisma db seed  
      ```  

4. **Start the Development Server**:  
   ```bash  
   yarn dev  
   ```  

5. **Use ngrok to test the full experience locally**:  
   ```bash  
   ngrok http --url=your-ngrok-url.ngrok-free.app 3000
   ```  

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

## Tech Stack  

- **Next.js**  
- **Prisma ORM**: For database management and migrations.  
- **Postgres** (hosted on Vercel): For handling product stock and reservations.  
- **Winston**: For logging and debugging.  

## License  

This project is licensed under the terms of the MIT license.  
