import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const endpoint = process.env.CLOUDFLARE_R2_ENDPOINT;
const bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME;
const cloudflairUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL;

if (
  !accessKeyId ||
  !secretAccessKey ||
  !endpoint ||
  !bucket ||
  !cloudflairUrl
) {
  throw new Error(
    "Missing Cloudflare R2 credentials in environment variables."
  );
}

const s3Client = new S3Client({
  region: "us-east-1",
  endpoint,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  forcePathStyle: true,
  defaultsMode: "legacy",
});

s3Client.middlewareStack.add(
  (next) => async (args: any) => {
    if (args.request && args.request.headers) {
      delete args.request.headers["x-amz-checksum-crc32"];
      delete args.request.headers["x-amz-checksum-sha256"];
      delete args.request.headers["x-amz-sdk-checksum-algorithm"];
    }
    return next(args);
  },
  {
    step: "finalizeRequest",
  }
);

export const uploadImageToR2 = async (
  bufferImg: Buffer,
  fileName: string
): Promise<string> => {
  try {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: fileName,
      Body: bufferImg,
      ContentType: "image/png",
    });

    await s3Client.send(command);

    return `${cloudflairUrl}/${fileName}`;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image.");
  }
};
