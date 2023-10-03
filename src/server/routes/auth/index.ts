import express from "express";
import registrationRouter from "./register";

const router = express.Router();

router.use("/register", registrationRouter);

export default router;
