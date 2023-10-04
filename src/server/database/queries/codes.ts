import { Code, User } from "../../types";
import { Query } from "../connection";

const get = (uuid: string) => Query<Code[]>("SELECT * FROM Codes WHERE id=$1", [uuid]);
const create = ({ id, user_id, expires_at, created_at }: Code) =>
    Query("INSERT INTO Codes (id, user_id, created_at, expires_at) VALUES ($1, $2, $3, $4)", [
        id,
        user_id,
        created_at,
        expires_at,
    ]);
const codeId = (uuid: string) => Query("DELETE FROM Codes WHERE id=$1", [uuid]);
const userId = (user_id: User["id"]) => Query("DELETE FROM Codes WHERE user_id=$1", [user_id]);

export default {
    get,
    create,
    deleteBy: {
        codeId,
        userId,
    },
};
