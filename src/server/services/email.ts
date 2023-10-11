import Mailgun from "mailgun.js";
import FormData from "form-data";
import { mg, domain } from "../config";
import { User } from "../types";
import { create_8_digit_num, create_uuid } from "./create_codes";

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

export const sendVerificationEmail = async (user_id: User["id"], email: string) => {
    try {
        const uuid = await create_uuid(user_id);
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
        const uuid = await create_uuid(user_id);
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

export const sendMFAEmail = async (user_id: User["id"], email: string) => {
    try {
        const id = await create_8_digit_num(user_id);

        await sendMail({
            to: email,
            from: "<Security> noreply@atlc.dev",
            subject: "Here is your MFA Code",
            body: `
    <h1>Your MFA code is <strong>${id}</strong></h1>
    <h2>Please note that any previous codes will be invalidated, and this code will only be valid for 15 minutes.</h2>
        `,
        });
    } catch (error) {
        throw error;
    }
};
