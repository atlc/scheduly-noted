import { RequestHandler } from "express";
import utils from "../utils";
import db from "../database";
import { sendMFAEmail, sendVerificationEmail } from "../services/email";

export const checkEm: RequestHandler = async (req, res, next) => {
    const { email, password, code } = req.body;

    const allAreGood = utils.validators.allStringsAreGood([
        [email, 128, 6],
        [password, 1000],
    ]);

    if (!allAreGood) {
        return res.status(400).json({ message: "Must include valid email/username and password" });
    }

    const isEmail = utils.validators.isEmail(email);

    try {
        const [user] = await db.users.lookup.by(isEmail ? "email" : "username", email);
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const passwordsMatch = await utils.passwords.check_em(password, user.password);
        if (!passwordsMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (user.email_verified) {
            if (user.mfa_preference === "none") {
                req.user = { id: user.id };
                next();
            } else if (user.mfa_preference === "email") {
                if (!code) {
                    await sendMFAEmail(user.id, user.email);
                    res.status(403).json({
                        message: "Please check your inbox for your temporary code.",
                        shouldShowCode: true,
                    });
                } else {
                    const [db_code] = await db.codes.get(code);
                    if (!db_code) {
                        await sendMFAEmail(user.id, user.email);
                        res.status(403).json({
                            message: "Invalid code - please check your inbox for your temporary code.",
                            shouldShowCode: true,
                        });
                    } else {
                        const now = Date.now();
                        if (now > db_code.expires_at) {
                            await sendMFAEmail(user.id, user.email);
                            res.status(403).json({
                                message: "Code expired - please check your inbox for your temporary code.",
                                shouldShowCode: true,
                            });
                        } else {
                            req.user = { id: user.id };
                            next();
                        }
                    }
                }
            } else {
                // do phone thingz
            }
        } else {
            await sendVerificationEmail(user.id, user.email);
            res.status(403).json({ message: "Verify your email in order to log in" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Could not process this request at this time" });
    }
};
