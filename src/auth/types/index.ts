import { Session } from 'express-session'

export type UserSessionData = {
    id: string
    email: string
    role: Role
}

export enum KitItems {
    FARM,
    SAM,
}

export enum Role {
    ADMIN,
    USER,
}

export type UserSession = Session & Record<'user', UserSessionData>
