import express from "express";
import db from "../../database";
import utils from "../../utils";

const router = express.Router();

router.post("/", async (req, res) => {
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
        const token = utils.tokens.sign({ id: result.insertId! });
        res.status(201).json({ message: "Successfully registered!", id: result.insertId, token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "SERVER'S BROKE" });
    }
});

export default router;
