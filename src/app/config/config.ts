import { Environment } from "@imtbl/sdk/x";

export const applicationEnvironment = process.env.NEXT_PUBLIC_IMMUTABLE_ENVIRONMENT?.toLowerCase() === Environment.PRODUCTION
  ? Environment.PRODUCTION
  : Environment.SANDBOX

const config = {
  [Environment.SANDBOX]: {
    immutablePublishableKey: process.env.NEXT_PUBLIC_SANDBOX_IMMUTABLE_PUBLISHABLE_KEY,
    passportClientId: process.env.NEXT_PUBLIC_SANDBOX_PASSPORT_CLIENT_ID,
    passportRedirectUri: process.env.NEXT_PUBLIC_SANDBOX_PASSPORT_LOGIN_REDIRECT_URI,
    passportLogoutRedirectUri: process.env.NEXT_PUBLIC_SANDBOX_PASSPORT_LOGOUT_REDIRECT_URI,
    primarySaleBackendUrl: "https://api.sandbox.immutable.com/v1/primary-sales",
    hubEnvironmentId: process.env.NEXT_PUBLIC_HUB_ENVIRONMENT_ID,
    explorerUrl: "https://explorer.testnet.immutable.com",
  },
  [Environment.PRODUCTION]: {
    immutablePublishableKey: process.env.NEXT_PUBLIC_MAINNET_IMMUTABLE_PUBLISHABLE_KEY,
    passportClientId: process.env.NEXT_PUBLIC_MAINNET_PASSPORT_CLIENT_ID,
    passportRedirectUri: process.env.NEXT_PUBLIC_MAINNET_PASSPORT_LOGIN_REDIRECT_URI,
    passportLogoutRedirectUri: process.env.NEXT_PUBLIC_MAINNET_PASSPORT_LOGOUT_REDIRECT_URI,
    primarySaleBackendUrl: "https://api.immutable.com/v1/primary-sales",
    hubEnvironmentId: process.env.NEXT_PUBLIC_HUB_ENVIRONMENT_ID,
    explorerUrl: "https://explorer.immutable.com",
  },
};

export default config;
