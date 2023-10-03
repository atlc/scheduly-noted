type SERIAL = number;
type VARCHAR = string;
type CHAR = string;
type TINYINT = 0 | 1;
type DATETIME = Date | string;

export interface User {
    id: SERIAL;
    name: VARCHAR;
    username: VARCHAR; // UNIQUE
    email: VARCHAR; // UNIQUE
    emailVerified: TINYINT; // DEFAULT 0
    phone: VARCHAR;
    phoneVerified: TINYINT; // DEFAULT 0
    password: CHAR; //60
    created_at: DATETIME;
}

export interface Event {
    id: SERIAL;
    user_id: User["id"];
    name: VARCHAR;
    description: VARCHAR;
    datetime: DATETIME;
}
