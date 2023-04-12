import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
    const logger = new Logger('Main')
    const app = await NestFactory.create(AppModule)
    const globalPrefix = 'api'
    const config = app.get<ConfigService>(ConfigService)
    const port = config.get<number>('SERVER_PORT')
    const nodeEnv = config.get<string>('NODE_ENV')
    const basePath = config.get<string>('BASEPATH')

    app.setGlobalPrefix(globalPrefix)
    await app.listen(port, () => {
        logger.log(`🚀 Application is running on: ${basePath}:${port}/${globalPrefix}`)
        logger.log(`Running in mode: ${nodeEnv} `)
    })
}
bootstrap()
