const aws = require('aws-sdk');
const { config } = require('../config/config');

aws.config.update({
  accessKeyId: config.cdn.accessKeyId,
  secretAccessKey: config.cdn.secretAccessKey,
  region: 'blr1',
  endpoint: 'https://b2bproject.blr1.digitaloceanspaces.com',
});

const s3 = new aws.S3();

module.exports = s3;
