import { SetMetadata } from '@nestjs/common'

export const IS_ADMIN_ROUTE = 'IS_ADMIN_ROUTE'
export const AdminRoute = () => SetMetadata(IS_ADMIN_ROUTE, true)
