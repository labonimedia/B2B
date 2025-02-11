const httpStatus = require('http-status');
const { S3Client } = require('@aws-sdk/client-s3');
const CDNPath = require('../models/cdn.path.model');

const initializeS3Client = async () => {
  const cdnConfig = await CDNPath.findOne({ status: 'active' }).lean();

  if (!cdnConfig) {
    throw new Error('No active CDN configuration found');
  }

  return new S3Client({
    region: cdnConfig.region,
    endpoint: `https://${cdnConfig.bucketName}.${cdnConfig.region}.digitaloceanspaces.com`,
    credentials: {
      accessKeyId: cdnConfig.accessKey,
      secretAccessKey: cdnConfig.secreteKey,
    },
    forcePathStyle: true,
  });
};

const cdnDtailes = async () => {
  const cdnConfig = await CDNPath.findOne({ status: 'active' }).lean();

  if (!cdnConfig) {
    throw new Error('No active CDN configuration found');
  }

  return cdnConfig;
};

module.exports = { initializeS3Client, cdnDtailes };
