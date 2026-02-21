import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

export const ENV = {
  PORT: process.env.PORT,
  VALKEY_HOST: process.env.VALKEY_HOST,
  VALKEY_PORT: process.env.VALKEY_PORT,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  QDRANT_URL: process.env.QDRANT_URL,
};
