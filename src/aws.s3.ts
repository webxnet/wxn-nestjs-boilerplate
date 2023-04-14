import { S3Client } from '@aws-sdk/client-s3'

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_BUCKET_NAME } = process.env

const s3Config = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
})

export const s3 = s3Config
export const Bucket = AWS_BUCKET_NAME
export const Region = AWS_REGION
