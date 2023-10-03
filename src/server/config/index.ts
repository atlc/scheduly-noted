import dotenv from "dotenv";
import { checkForMissingProperties } from "../utils/validators";
dotenv.config();

export const db = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
};

export const token = {
    key: process.env.TOKEN_KEY as string,
};

const missingProperties = checkForMissingProperties({ ...db, ...token });
if (missingProperties) throw new Error("MISSING REQUIRED ENVARS");
