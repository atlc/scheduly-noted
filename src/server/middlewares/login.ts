import { RequestHandler } from "express";
import utils from "../utils";
import db from "../database";
import { sendVerificationEmail } from "../services/email";

export const checkEm: RequestHandler = async (req, res, next) => {
    const { email, password } = req.body;

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

        if (user.emailVerified) {
            req.user = { id: user.id };
            next();
        } else {
            await sendVerificationEmail(user.id, user.email);
            res.status(403).json({ message: "Verify your email in order to log in" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Could not process this request at this time" });
    }
};
