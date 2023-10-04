import express from "express";
import utils from "../../utils";
import mw from "../../middlewares";

const router = express.Router();

router.post("/", mw.login, (req, res) => {
    const token = utils.tokens.sign({ id: req.user.id });
    res.status(200).json({ message: "Successfully logged in!", token });
});

export default router;
