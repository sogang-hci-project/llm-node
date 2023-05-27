import dotenv from "dotenv";
dotenv.config();

export const openAIApiKey = process.env.OPENAI_API_KEY;
export const isProd = process.env.NODE_ENV === "production";
