import { User } from "../../types";
import { Query } from "../connection";

interface NewUser {
    name: string;
    email: string;
    username: string;
    password: string;
    phone: string;
}

type columns = "email" | "username" | "id";

const by = (column: columns, value: string | number) =>
    Query<User[]>(`SELECT * FROM Users WHERE ${column}=$1`, [value]);

const register = ({ name, email, username, password, phone }: NewUser) =>
    Query(`INSERT INTO Users (name, email, username, password, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id`, [
        name,
        email,
        username,
        password,
        phone,
    ]);

const verify = (id: User["id"]) => Query("UPDATE Users SET email_verified=1 WHERE id=$1", [id]);

const change_mfa = (preference: User["mfa_preference"], user_id: User["id"]) =>
    Query("UPDATE Users SET mfa_preference=$1 WHERE id=$2", [preference, user_id]);

export default {
    register,
    update: {
        mfa: change_mfa,
    },
    lookup: {
        by,
    },
    verify,
};
