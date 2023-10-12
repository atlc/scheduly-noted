import express from "express";
import mw from "../../middlewares";
import controllers from "../../controllers";

const router = express.Router();

router.post("/", mw.login, controllers.auth.login);

export default router;
