import { Environment } from "@imtbl/sdk/x";

export const applicationEnvironment =
  process.env.NEXT_PUBLIC_IMMUTABLE_ENVIRONMENT === Environment.PRODUCTION
    ? Environment.PRODUCTION
    : Environment.SANDBOX;

const config = {
  [Environment.SANDBOX]: {
    immutablePublishableKey: process.env.NEXT_PUBLIC_SANDBOX_IMMUTABLE_PUBLISHABLE_KEY,
    passportClientId: process.env.NEXT_PUBLIC_SANDBOX_PASSPORT_CLIENT_ID,
    passportRedirectUri: process.env.NEXT_PUBLIC_SANDBOX_PASSPORT_LOGIN_REDIRECT_URI,
    passportLogoutRedirectUri: process.env.NEXT_PUBLIC_SANDBOX_PASSPORT_LOGOUT_REDIRECT_URI,
    mintingBackendApiBaseUrl: process.env.NEXT_PUBLIC_MINTING_BACKEND_API_BASE_URL,
    explorerUrl: "https://explorer.testnet.immutable.com",
  },
  [Environment.PRODUCTION]: {
    immutablePublishableKey: process.env.NEXT_PUBLIC_MAINNET_IMMUTABLE_PUBLISHABLE_KEY,
    passportClientId: process.env.NEXT_PUBLIC_MAINNET_PASSPORT_CLIENT_ID,
    passportRedirectUri: process.env.NEXT_PUBLIC_MAINNET_PASSPORT_LOGIN_REDIRECT_URI,
    passportLogoutRedirectUri: process.env.NEXT_PUBLIC_MAINNET_PASSPORT_LOGOUT_REDIRECT_URI,
    mintingBackendApiBaseUrl: process.env.NEXT_PUBLIC_MINTING_BACKEND_API_BASE_URL,
    explorerUrl: "https://explorer.immutable.com",
  },
};

export default config;
