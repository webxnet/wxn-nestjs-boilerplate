import * as multer from 'multer'
import * as multerS3 from 'multer-s3'
import { v4 as uuid } from 'uuid'
import { Bucket, s3 } from './aws.s3'

export const multerS3Config = multer({
    storage: multerS3({
        s3,
        bucket: Bucket,
        acl: 'public-read',
        key: (req, file, cb) => {
            cb(null, `images/${uuid()}.${file.mimetype.split('/')[1]}`)
        },
    }),
})
