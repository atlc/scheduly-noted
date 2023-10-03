import bcrypt from "bcrypt";

const slinging_slasher = (plaintext: string) => bcrypt.hash(plaintext, 12);
const check_em = (plaintext: string, hashed: string) => bcrypt.compare(plaintext, hashed);

export default {
    slinging_slasher,
    check_em,
};
