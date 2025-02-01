import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const BUCKET_ENDPOINT = `${process.env.CLOUDFLARE_R2_ENDPOINT}`;
const ACCESS_KEY = `${process.env.CLOUDFLARE_R2_ACCESS_KEY_ID}`;
const SECRET_KEY = `${process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY}`;

if (!BUCKET_ENDPOINT || !ACCESS_KEY || !SECRET_KEY) {
  throw new Error("S3 client variables missing.");
}

export const s3Client = new S3Client({
  region: "auto",
  endpoint: BUCKET_ENDPOINT,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
});
