import db from "../database";
import { User } from "../types";
import crypto from "crypto";

const FIFTEEN_MINUTES = 1000 * 60 * 15;

export const create_uuid = async (user_id: User["id"]) => {
    try {
        await db.codes.deleteBy.userId(user_id);
        const uuid = crypto.randomUUID();
        const created_at = Date.now();
        const expires_at = created_at + FIFTEEN_MINUTES;
        await db.codes.create({ id: uuid, user_id, created_at, expires_at });
        return uuid;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const create_8_digit_num = async (user_id: User["id"]) => {
    try {
        await db.codes.deleteBy.userId(user_id);

        function generateCode() {
            const random = crypto.randomInt(1e8).toString();

            if (random.length < 8) {
                return generateCode();
            }

            return random;
        }

        const id = generateCode();

        const created_at = Date.now();
        const expires_at = created_at + FIFTEEN_MINUTES;
        await db.codes.create({ id, user_id, created_at, expires_at });
        return id;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
