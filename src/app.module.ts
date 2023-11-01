import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './prisma/prisma.module'
import { S3Service } from './s3/s3.service'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        PrismaModule,
        UserModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [
        {
            provide: 'APP_GUARD',
            useClass: JwtAuthGuard,
        },
        AppService,
        S3Service,
    ],
})
export class AppModule {}
