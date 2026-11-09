import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  auth: false,
  buckets: {
    // Primary upload bucket (env S3_BUCKET=uploads) — public read for registry photos
    uploads: { access: "public_read" },
    // Keep private bucket for sensitive files
    assets: { access: "private" },
    "public-assets": { access: "public_read" },
  },
  branch: (branch) => {
    if (branch.isDefault) {
      return {};
    }
    if (!branch.exists) {
      return { ttl: "7d" };
    }
    return {};
  },
});
