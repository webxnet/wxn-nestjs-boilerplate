import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Role } from '@prisma/client'
import { Request } from 'express'
import { Observable } from 'rxjs'
import { IS_ADMIN_ROUTE } from '../decorators/is-admin.decorator'
import { UserSession } from '../types'

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const isAdminRoute = this.reflector.getAllAndOverride<boolean>(IS_ADMIN_ROUTE, [
            context.getClass(),
            context.getHandler(),
        ])

        // if  not admin route, bypass authorization
        if (!isAdminRoute) return true

        const request = context.switchToHttp().getRequest() as Request

        const { user: currentUser } = request.session as UserSession

        if (currentUser.role !== Role.ADMIN) throw new UnauthorizedException('Reserved for admins.')

        return true
    }
}
