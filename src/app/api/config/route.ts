import serverConfig, { environment } from "@/config";
import { NextResponse } from "next/server";

export async function GET() {
  const configForCurrentEnv = serverConfig[environment];

  // Example use of configuration
  const response = {
    host: configForCurrentEnv.HOST_IP,
    port: configForCurrentEnv.PORT,
    apiKey: configForCurrentEnv.INVENTORY_API_KEY,
  };

  return NextResponse.json(response);
}
