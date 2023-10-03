import jwt from "jsonwebtoken";
import { Payload } from "../types";
import { token as jwtConfig } from "../config";

const sign = (lmao: Payload) => {
    return jwt.sign(lmao, jwtConfig.key, { expiresIn: "15d" });
};

const validate = (token: string) => {
    return jwt.verify(token, jwtConfig.key) as Payload;
};

export default {
    sign,
    validate,
};
