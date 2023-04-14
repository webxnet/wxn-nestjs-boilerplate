import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './prisma/prisma.module'
import { S3Service } from './s3/s3.service'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard'

@Module({
    imports: [
        PrismaModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        UserModule,
        AuthModule,
    ],
    controllers: [],
    providers: [
        S3Service,
        {
            provide: 'APP_GUARD',
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
