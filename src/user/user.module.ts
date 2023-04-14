import { Module } from '@nestjs/common'
import { PrismaModule } from './../prisma/prisma.module'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { S3Service } from 'src/s3/s3.service'

@Module({
    imports: [PrismaModule],
    controllers: [UserController],
    providers: [UserService, S3Service],
    exports: [UserService],
})
export class UserModule {}
