import Mailgun from "mailgun.js";
import FormData from "form-data";
import { v4 } from "uuid";
import db from "../database";
import { mg, domain } from "../config";
import { User } from "../types";

if (!mg.key) throw new Error("Missing required key for mailgun");

const client = new Mailgun(FormData).client({
    username: "api",
    key: mg.key,
});

interface MailProps {
    to: string;
    from: string;
    subject: string;
    body: string;
}

const sendMail = ({
    to,
    from,
    subject = "We've been trying to reach you about your car's extended warranty",
    body,
}: MailProps) => {
    return client.messages.create(mg.domain!, { to, from, subject, html: body });
};

const FIFTEEN_MINUTES = 1000 * 60 * 15;

export const sendVerificationEmail = async (user_id: User["id"], email: string) => {
    try {
        await db.codes.deleteBy.userId(user_id);
        const uuid = v4();
        const created_at = Date.now();
        const expires_at = created_at + FIFTEEN_MINUTES;
        await db.codes.create({ id: uuid, user_id, created_at, expires_at });
        await sendMail({
            to: email,
            from: "<Registration> noreply@atlc.dev",
            subject: "Click the link plz",
            body: `
    <h1>Click the link to <a href="${domain.base}/verify?code=${uuid}&type=verify">verify your account</a></h1>
    <h2>Please note that any previous codes will be invalidated, and this code will only be valid for 15 minutes.</h2>
        `,
        });
    } catch (error) {
        throw error;
    }
};

export const sendMagicLink = async (user_id: User["id"], email: string) => {
    try {
        await db.codes.deleteBy.userId(user_id);
        const uuid = v4();
        const created_at = Date.now();
        const expires_at = created_at + FIFTEEN_MINUTES;
        await db.codes.create({ id: uuid, user_id, created_at, expires_at });
        await sendMail({
            to: email,
            from: "<Magic Link> noreply@atlc.dev",
            subject: "Here is your magic link to login",
            body: `
    <h1>Click the link to <a href="${domain.base}/verify?code=${uuid}&type=magic">login</a></h1>
    <h2>Please note that any previous codes will be invalidated, and this code will only be valid for 15 minutes.</h2>
        `,
        });
    } catch (error) {
        throw error;
    }
};
