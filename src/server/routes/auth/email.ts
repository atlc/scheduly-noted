import express from "express";
import controllers from "../../controllers";

const router = express.Router();

router.get("/verify", controllers.auth.verify);
router.get("/magic", controllers.auth.sendMagic);

export default router;
