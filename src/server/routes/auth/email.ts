import express from "express";
import db from "../../database";
import utils from "../../utils";
import { sendVerificationEmail } from "../../services/email";

const router = express.Router();

router.get("/verify", async (req, res) => {
    const codeParam = req.query.code as string;

    if (!codeParam) return res.status(400).json({ message: "Missing code from the URL!" });
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

        await db.users.verify(user_id);
        const token = utils.tokens.sign({ id: user.id });
        await db.codes.deleteBy.userId(user_id);
        res.status(200).json({ message: "You have now verified your account and are successfully logged in!", token });
    } catch (error) {
        const err = error as Error;
        if (user_id && email) {
            sendVerificationEmail(user_id, email);
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
    }
});

export default router;
