import { Injectable } from '@nestjs/common'
import * as AWS from 'aws-sdk'

@Injectable()
export class S3Service {
    private s3: AWS.S3

    constructor() {
        this.s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
            signatureVersion: 'v4',
        })
    }

    async uploadImage(buffer: Buffer, mimetype: string, key: string): Promise<string | undefined> {
        const params: AWS.S3.PutObjectRequest = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: mimetype,
            ServerSideEncryption: 'aws:kms',
        }

        await this.s3.upload(params).promise()

        return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
    }

    async getSignedUrl(key: string): Promise<string> {
        const params: AWS.S3.GetObjectRequest = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
        }

        return this.s3.getSignedUrlPromise('getObject', params)
    }

    async deleteImage(key: string): Promise<void> {
        const params: AWS.S3.DeleteObjectRequest = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
        }

        await this.s3.deleteObject(params).promise()
    }
}
