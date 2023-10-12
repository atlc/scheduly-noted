import db from "../database";
import utils from "../utils";
import { sendMagicLink, sendVerificationEmail } from "../services/email";
import { RequestHandler } from "express";

type TokenType = "magic" | "verify";

const verify: RequestHandler = async (req, res, next) => {
    const codeParam = req.query.code as string;
    const type = req.query.type as TokenType;

    if (!codeParam || !type) return res.status(400).json({ message: "Missing code or type from the URL!" });
    let user_id, email;

    try {
        const [code] = await db.codes.get(codeParam);
        if (!code) throw new Error("Missing code");

        const [user] = await db.users.lookup.by("id", code.user_id);
        if (!user) throw new Error("Invalid user");
        user_id = user.id;
        email = user.email;

        const now = Date.now();
        const isExpired = code.expires_at < now;
        if (isExpired) throw new Error("Code expired");

        if (!user.email_verified) await db.users.verify(user_id);

        const token = utils.tokens.sign({ id: user.id });
        await db.codes.deleteBy.userId(user_id);
        res.status(200).json({ message: "You have now verified your account and are successfully logged in!", token });
    } catch (error) {
        const err = error as Error;
        if (type === "verify") {
            if (user_id && email) {
                await sendVerificationEmail(user_id, email);
                res.status(401).json({
                    message:
                        "Unable to verify your account - " +
                        err.message +
                        ". Please check your email for a new code (expires in 15 minutes).",
                });
            } else {
                res.status(401).json({
                    message:
                        "Unable to verify your account - " +
                        err.message +
                        ". Please try logging in again to resend a verification email (expires in 15 minutes).",
                });
            }
        } else if (type === "magic") {
            if (user_id && email) {
                await sendMagicLink(user_id, email);
                res.status(401).json({
                    message:
                        "Unable to login with magic link - " +
                        err.message +
                        ". Please check your email for a new code (expires in 15 minutes).",
                });
            } else {
                res.status(401).json({
                    message:
                        "Unable to login with magic link - " +
                        err.message +
                        ". Please try requesting another magic link (expires in 15 minutes).",
                });
            }
        } else {
            res.status(401).json({
                message:
                    "Unable to verify your account - " +
                    err.message +
                    ". Please try logging in again to resend a verification email (expires in 15 minutes).",
            });
        }
    }
};

const sendMagic: RequestHandler = async (req, res, next) => {
    const email = req.query.email as string;
    if (!email) return res.status(400).json({ message: "Missing email from query params" });

    try {
        const [user] = await db.users.lookup.by("email", email);
        if (!user) throw new Error("Invalid user");

        await sendMagicLink(user.id, email);
        res.status(200).json({ message: "Message sent successfully, please check your email for the magic link" });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred either looking up the account or sending the email, please try again later",
        });
    }
};

const login: RequestHandler = (req, res) => {
    const token = utils.tokens.sign({ id: req.user.id });
    res.status(200).json({ message: "Successfully logged in!", token });
};

const register: RequestHandler = async (req, res) => {
    const { name, email, username, password, phone } = req.body;

    const missingProperties = utils.validators.checkForMissingProperties({ name, email, username, password, phone });

    if (missingProperties) {
        return res.status(400).json({ message: "Error - missing the following properties: " + missingProperties });
    }

    if (
        !utils.validators.allStringsAreGood([
            [name, 64],
            [username, 32],
            [email, 128, 5],
            [phone, 16],
            [password, 1000],
        ])
    ) {
        return res.status(400).json({ message: "Some values are not strings or exceed their max length" });
    }

    if (!utils.validators.isEmail(email)) {
        res.status(400).json({ message: "You must present a valid email address in order to use this application" });
        return;
    }

    if (utils.validators.isEmail(username)) {
        res.status(400).json({ message: "Your username cannot be an email" });
        return;
    }

    try {
        const hashed = await utils.passwords.slinging_slasher(password);
        const result = await db.users.register({ name, email, username, password: hashed, phone });
        await sendVerificationEmail(result.insertId!, email);
        res.status(201).json({
            message:
                "Successfully registered! Please check your email to verify your account to continue using the site.",
            id: result.insertId,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "SERVER'S BROKE" });
    }
};

const tokenCheck: RequestHandler = async (req, res) => {
    res.status(200).json({ message: "YEEEE it's good" });
};

export default {
    verify,
    sendMagic,
    login,
    register,
    tokenCheck,
};
