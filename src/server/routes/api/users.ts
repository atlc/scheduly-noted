import express from "express";
import { tokenCheck } from "../../middlewares/verify";
import db from "../../database";
import { User } from "../../types";
import { sendVerificationEmail } from "../../services/email";

const router = express.Router();

router.put("/mfa", tokenCheck, async (req, res) => {
    const { preference } = req.body as { preference: User["mfa_preference"] };

    if (!["phone", "email", "none"].includes(preference)) {
        return res.status(400).json({ message: `${preference} is not a valid MFA option` });
    }

    try {
        const [user] = await db.users.lookup.by("id", req.user.id);
        await db.users.update.mfa(preference, req.user.id);

        if (preference === "phone") {
            if (!user.phone_verified) {
                // RESEND TEXT
                return res
                    .status(403)
                    .json({ message: "You cannot do that action until you verify your phone number" });
            } else {
                await db.users.update.mfa("phone", req.user.id);
                return res.status(201).json({ message: "Preference updated!" });
            }
        }

        if (preference === "email") {
            if (!user.email_verified) {
                await sendVerificationEmail(req.user.id, user.email);
                return res.status(403).json({ message: "You cannot do that action until you verify your account" });
            } else {
                await db.users.update.mfa("email", req.user.id);
                return res.status(201).json({ message: "Preference updated!" });
            }
        }

        if (preference === "none") {
            await db.users.update.mfa("none", req.user.id);
            return res.status(201).json({ message: "Preference updated!" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Couldn't update MFA preferences at moment" });
    }
});

export default router;
