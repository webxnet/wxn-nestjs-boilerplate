import { INestApplication, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { Prisma, PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService
    extends PrismaClient<Prisma.PrismaClientOptions, Prisma.LogLevel>
    implements OnModuleInit
{
    private readonly logger = new Logger(PrismaService.name)
    constructor() {
        super({
            log: [
                {
                    emit: 'event',
                    level: 'query',
                },
                {
                    emit: 'event',
                    level: 'error',
                },
                {
                    emit: 'event',
                    level: 'info',
                },
                {
                    emit: 'event',
                    level: 'warn',
                },
            ],
            errorFormat: 'colorless',
        })
    }

    async onModuleInit() {
        try {
            this.$on('error', (event) => {
                this.logger.error(event)
            })
            this.$on('warn', (event) => {
                this.logger.warn(event)
            })
            this.$on('info', (event) => {
                this.logger.verbose(event)
            })
            this.$on('query', (event) => {
                this.logger.log(event)
            })

            await this.$connect()
        } catch (error) {
            console.error('Prisma connection error', error)
        }
    }

    cleanDb() {
        return this.$transaction([])
    }
}
