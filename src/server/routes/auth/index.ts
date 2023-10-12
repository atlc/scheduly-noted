import express from "express";
import loginRouter from "./login";
import emailAuthRouter from "./email";
import registrationRouter from "./register";
import controllers from "../../controllers";
import mw from "../../middlewares";

const router = express.Router();

router.use("/login", loginRouter);
router.use("/email", emailAuthRouter);
router.use("/register", registrationRouter);
router.get("/verify", mw.tokenCheck, controllers.auth.tokenCheck);

export default router;
