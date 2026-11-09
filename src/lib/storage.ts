import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";
import { patchDnsForNeonLocal } from "./dns-fix";

function publicBucket() {
  return process.env.S3_BUCKET || "uploads";
}

function privateBucket() {
  return "assets";
}

function requireStorageEnv() {
  const required = [
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
    "AWS_ENDPOINT_URL_S3",
    "AWS_REGION",
  ] as const;
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`${key} is missing. Run \`neon deploy\` or set .env.local.`);
    }
  }
}

export function s3() {
  patchDnsForNeonLocal();
  requireStorageEnv();
  return new S3Client({
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_ENDPOINT_URL_S3,
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
}

export function publicObjectUrl(key: string) {
  const endpoint = process.env.AWS_ENDPOINT_URL_S3?.replace(/\/$/, "");
  if (!endpoint) {
    throw new Error("AWS_ENDPOINT_URL_S3 is missing");
  }
  return `${endpoint}/${publicBucket()}/${key}`;
}

export async function uploadPublicImage(input: {
  bytes: Buffer | Uint8Array;
  contentType: string;
  folder?: string;
  extension?: string;
}) {
  const ext =
    input.extension ||
    (input.contentType.includes("png")
      ? "png"
      : input.contentType.includes("webp")
        ? "webp"
        : "jpg");
  const folder = input.folder || "registry";
  const key = `${folder}/${nanoid()}.${ext}`;
  const client = s3();
  await client.send(
    new PutObjectCommand({
      Bucket: publicBucket(),
      Key: key,
      Body: input.bytes,
      ContentType: input.contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
  return { key, url: publicObjectUrl(key) };
}

export async function uploadPrivateBytes(input: {
  bytes: Buffer | Uint8Array;
  contentType: string;
  key?: string;
}) {
  const key = input.key || `private/${nanoid()}`;
  const client = s3();
  await client.send(
    new PutObjectCommand({
      Bucket: privateBucket(),
      Key: key,
      Body: input.bytes,
      ContentType: input.contentType,
    }),
  );
  const url = await getSignedUrl(
    client,
    new GetObjectCommand({ Bucket: privateBucket(), Key: key }),
    { expiresIn: 3600 },
  );
  return { key, url };
}
