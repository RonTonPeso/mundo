const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;
const BUILD_DIR = path.join(__dirname, '../dist');

async function uploadFile(filePath, key) {
  const fileContent = fs.readFileSync(filePath);
  const contentType = mime.lookup(filePath) || 'application/octet-stream';

  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: fileContent,
    ContentType: contentType,
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    console.log(`Uploaded ${key}`);
  } catch (err) {
    console.error(`Error uploading ${key}:`, err);
  }
}

async function uploadDirectory(directory, prefix = '') {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      await uploadDirectory(filePath, path.join(prefix, file));
    } else {
      const key = path.join(prefix, file).replace(/\\/g, '/');
      await uploadFile(filePath, key);
    }
  }
}

async function deploy() {
  if (!BUCKET_NAME) {
    console.error('Please set S3_BUCKET_NAME environment variable');
    process.exit(1);
  }

  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.error('Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables');
    process.exit(1);
  }

  console.log('Starting deployment...');
  await uploadDirectory(BUILD_DIR);
  console.log('Deployment complete!');
}

deploy().catch(console.error); 