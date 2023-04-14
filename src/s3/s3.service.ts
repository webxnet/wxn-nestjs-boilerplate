import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { ConsoleLogger, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class S3Service {
    private s3: S3Client

    constructor(
        private readonly logger: ConsoleLogger,
        private readonly configService: ConfigService,
    ) {
        this.s3 = new S3Client({
            region: this.configService.get('AWS_REGION'),
            credentials: {
                accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
            },
        })
    }

    async uploadImage(buffer: Buffer, mimetype: string, key: string): Promise<string | undefined> {
        try {
            await this.s3.send(
                new PutObjectCommand({
                    Bucket: this.configService.get('AWS_BUCKET_NAME'),
                    Key: key,
                    Body: buffer,
                    ContentType: mimetype,
                    ServerSideEncryption: 'aws:kms',
                }),
            )
            return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
        } catch (error) {
            this.logger.error(error)
            throw error
        }
    }
}
