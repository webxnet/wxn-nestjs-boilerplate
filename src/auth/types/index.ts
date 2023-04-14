import { Session } from 'express-session'
import { Role } from '@prisma/client'

export type UserSessionData = {
    id: string
    email: string
    role: Role
}

export type UserSession = Session & Record<'user', UserSessionData>
