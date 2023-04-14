export interface UserPayload {
    sub: string
    email: string
    username: string
    avatarUrl?: string
    iat?: number
    exp?: number
}
