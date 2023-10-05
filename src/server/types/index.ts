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
    email_verified: TINYINT; // DEFAULT 0
    phone: VARCHAR;
    phone_verified: TINYINT; // DEFAULT 0
    password: CHAR; //60
    created_at: DATETIME;
    image_url: VARCHAR;
}

export interface Event {
    id: SERIAL;
    user_id: User["id"];
    name: VARCHAR;
    description: VARCHAR;
    datetime: DATETIME;
}

export interface Payload {
    id: User["id"];
}

export interface Code {
    id: CHAR; // 36, UUID
    user_id: User["id"];
    created_at: number; // Date.now()
    expires_at: number; // Date.now()
}

declare global {
    namespace Express {
        export interface Request {
            user: Payload;
        }
    }
}
