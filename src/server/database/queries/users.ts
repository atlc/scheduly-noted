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
    Query<User[]>("SELECT * FROM Users WHERE $1=$2", [column, value]);

const register = ({ name, email, username, password, phone }: NewUser) =>
    Query(`INSERT INTO Users (name, email, username, password, phone) VALUES ($1, $2, $3, $4, $5)`, [
        name,
        email,
        username,
        password,
        phone,
    ]);

const verify = (id: User["id"]) => Query("UPDATE Users SET emailVerified=1 WHERE id=$1", [id]);

export default {
    register,
    lookup: {
        by,
    },
    verify,
};
