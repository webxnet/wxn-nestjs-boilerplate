import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { User } from 'src/user/entities/user.entity'
import { AuthRequest } from '../models/AuthRequest'
import { UserSession } from '../types'

export const CurrentUser = createParamDecorator(
    (data: unknown, context: ExecutionContext): User => {
        const request = context.switchToHttp().getRequest<AuthRequest>()

        return request.user
    },
)

export const GetUserId = createParamDecorator((data: undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<AuthRequest>()
    const session = request.session as UserSession

    return Number(session.user?.id)
})
