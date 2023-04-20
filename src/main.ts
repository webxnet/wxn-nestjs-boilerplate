import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { PrismaService } from './prisma/prisma.service'

async function bootstrap() {
    const logger = new Logger('Main')
    const app = await NestFactory.create(AppModule)
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    )
    //const globalPrefix = 'kit'
    const prismaService = app.get(PrismaService)
    await prismaService.enableShutdownHooks(app)
    const config = app.get<ConfigService>(ConfigService)
    const port = config.get<number>('SERVER_PORT')
    const nodeEnv = config.get<string>('NODE_ENV')
    const basePath = config.get<string>('BASEPATH')

    //app.setGlobalPrefix(globalPrefix)
    await app.listen(port, () => {
        logger.log(`🚀 Application is running on: ${basePath}:${port}/`)
        //${globalPrefix}
        logger.log(`Running in mode: ${nodeEnv} `)
    })
}
bootstrap()
