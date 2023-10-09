import {AWS_ACCESS_KEY,AWS_SECRET_KEY,BUCKET_REGION} from "../config/config"
import {S3Client,} from "@aws-sdk/client-s3";

const s3 = new S3Client({
    credentials:{
        accessKeyId:AWS_ACCESS_KEY,
        secretAccessKey:AWS_SECRET_KEY
    },
    region:BUCKET_REGION
})

export default s3;