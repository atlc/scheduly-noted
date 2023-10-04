import express from "express";
import registrationRouter from "./register";
import loginRouter from "./login";
import emailAuthRouter from "./email";

const router = express.Router();

router.use("/register", registrationRouter);
router.use("/login", loginRouter);
router.use("/email", emailAuthRouter);

export default router;
