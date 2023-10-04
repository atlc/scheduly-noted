import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { RequestHandler } from "express";
import { token as tokenConfig } from "../config";
import { Payload } from "../types";

export const tokenCheck: RequestHandler = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Missing auth headers" });

    const [type, tokenBody] = authHeader.split(" ");
    if (!type || !tokenBody || type !== "Bearer")
        return res.status(401).json({ message: "Incorrectly formatted auth headers" });

    try {
        const payload = jwt.verify(tokenBody, tokenConfig.key) as Payload;
        req.user = { ...payload };
        next();
    } catch (error) {
        const err = error as JsonWebTokenError;
        res.status(401).json({ message: "Bad token lol - " + err.message });
    }
};
