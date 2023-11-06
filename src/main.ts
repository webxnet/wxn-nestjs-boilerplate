import { Logger, ValidationPipe, VersioningType } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module'

async function bootstrap() {
    const logger = new Logger('Main')
    const app = await NestFactory.create<NestExpressApplication>(AppModule)
    app.setViewEngine('hbs')
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
    app.enableShutdownHooks()
    /* prismaService.$on('query', (event) => {
        console.log(event)
    }) */

    app.enableVersioning({
        type: VersioningType.URI,
    })
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
