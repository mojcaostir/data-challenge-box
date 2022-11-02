import { config } from "dotenv";

export function setupConfig(): void {
  const path = `${__dirname}/../.env.example`;
  config({ path });
}

setupConfig();

export {};
