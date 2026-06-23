import dotenv from "dotenv";

dotenv.config();

const required = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

export const config = {
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:3000",
  jwtSecret: required("JWT_SECRET"),
  mongoUri: required("MONGODB_URI"),
  port: Number(process.env.PORT ?? 4000),
};
