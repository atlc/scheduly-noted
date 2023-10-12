import express from "express";
import { tokenCheck } from "../../middlewares/verify";
import controllers from "../../controllers";

const router = express.Router();

router.put("/mfa", tokenCheck, controllers.users.mfa);

export default router;
