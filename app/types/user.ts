// type interface for user
export interface UserLoginData {
    id?: number
    name: string
    email: string | null
    hashedPassword: string | null
    sessionToken: string | null
    isTokenValid: boolean | null
}