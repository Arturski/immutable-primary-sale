import { config } from "@imtbl/sdk";
import { ServerConfig } from "./types";

// Access environment variables using process.env
export const environment = process.env.NEXT_PUBLIC_ENVIRONMENT === "PRODUCTION"
  ? config.Environment.PRODUCTION
  : config.Environment.SANDBOX;

const serverConfig: ServerConfig = {
  [config.Environment.SANDBOX]: {
    HOST_IP: process.env.NEXT_PUBLIC_SANDBOX_HOST_IP!,
    PORT: parseInt(process.env.NEXT_PUBLIC_SANDBOX_PORT!, 10),
    INVENTORY_API_KEY: process.env.NEXT_PUBLIC_INVENTORY_API_KEY!,
    RESERVATION_TIME: process.env.NEXT_PUBLIC_RESERVATION_TIME!,
    enableFileLogging: true, // Should logs be output to files or just console?
    logLevel: "debug",
    enableWebhookVerification: true, // Should the server verify the webhook SNS messages?
    allowedTopicArn: "arn:aws:sns:us-east-2:362750628221:*", // Used for webhook SNS verification
  },
  [config.Environment.PRODUCTION]: {
    HOST_IP: process.env.NEXT_PUBLIC_MAINNET_HOST_IP!,
    PORT: parseInt(process.env.NEXT_PUBLIC_MAINNET_PORT!, 10),
    INVENTORY_API_KEY: process.env.NEXT_PUBLIC_INVENTORY_API_KEY!,
    RESERVATION_TIME: process.env.NEXT_PUBLIC_RESERVATION_TIME!,
    enableFileLogging: true, // Should logs be output to files or just console?
    logLevel: "debug",
    enableWebhookVerification: true, // Should the server verify the webhook SNS messages?
    allowedTopicArn: "arn:aws:sns:us-east-2:362750628221:*", // Used for webhook SNS verification
  },
};

export default serverConfig;
