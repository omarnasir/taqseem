import { hash, compare } from 'bcryptjs';

export async function hashPassword(password: string) {
    const hashedPassword = hash(password, 8);
    return hashedPassword;
}

export async function verifyPassword(password: string, hashedPassword: string) {
    const isValid = await compare(password, hashedPassword);
    return isValid;
}