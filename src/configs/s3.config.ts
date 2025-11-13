import { S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_S3_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_S3_BUCKET_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_S3_BUCKET_SECRET_KEY!,
  },
});

export default s3;
