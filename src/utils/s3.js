const { S3Client } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  region: 'blr1',
  endpoint: 'https://lmscontent-cdn.blr1.digitaloceanspaces.com',
  credentials: {
    accessKeyId: 'DO00DZCVAHQ9YVMP7D8C',
    secretAccessKey: 'm3eBoCCD9ie4P87E74LO8fVsDQ+K7ZK0B5U1CXrk2Oc',
  },
  forcePathStyle: true, // Ensure path style is used
});

module.exports = s3Client;
