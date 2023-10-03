import { Query } from "../connection";

interface NewUser {
    name: string;
    email: string;
    username: string;
    password: string;
    phone: string;
}

type columns = "email" | "username";

const by = (column: columns, value: string) => Query("SELECT * FROM Users WHERE $1=$2", [column, value]);

const register = ({ name, email, username, password, phone }: NewUser) =>
    Query(`INSERT INTO Users (name, email, username, password, phone) VALUES ($1, $2, $3, $4, $5)`, [
        name,
        email,
        username,
        password,
        phone,
    ]);

export default {
    register,
    lookup: {
        by,
    },
};
