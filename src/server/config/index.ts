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

export const mg = {
    to: process.env.MAILGUN_TO,
    domain: process.env.MAILGUN_DOMAIN,
    key: process.env.MAILGUN_API_KEY,
};

export const tw = {
    number: process.env.TWILIO_NUM,
    sid: process.env.TWILIO_SID,
    token: process.env.TWILIO_TOKEN,
};

export const domain = {
    base: process.env.DOMAIN_BASE,
};

const missingProperties = checkForMissingProperties({ ...db, ...token, ...mg, ...tw, ...domain });
if (missingProperties) throw new Error("MISSING REQUIRED ENVARS");
