const { parentPort } = require('worker_threads');
const Redis = require('ioredis');
const { CDNPath } = require('./models'); // CDNPath model
const { getSpaceUsage } = require('./utils/upload'); // Function to fetch CDN bucket usage

// Redis setup
const redisClient = new Redis();

console.log('CDN Worker started.');

async function handleCdnSwitching() {
  console.log('Fetching active CDN from Redis...');

  // Fetch the active CDN from Redis cache
  let activeCdn = await redisClient.get('activeCDN');
  if (!activeCdn) {
    console.log('No active CDN in Redis. Fetching from database...');
    activeCdn = await CDNPath.findOne({ status: 'active' });
    if (!activeCdn) {
      console.error('No active CDN found in the database.');
      return;
    }

    // Cache the active CDN in Redis
    await redisClient.set('activeCDN', JSON.stringify(activeCdn));
  } else {
    activeCdn = JSON.parse(activeCdn);
  }

  console.log(`Active CDN: ${activeCdn.bucketName}`);

  // Check space usage of the active CDN bucket
  const spaceUsed = await getSpaceUsage(activeCdn.bucketName);
  console.log(`Space usage for bucket (${activeCdn.bucketName}): ${spaceUsed.usedSizeInGB} GB`);

  if (spaceUsed.usedSizeInGB >= 23) {
    console.log(`Active CDN (${activeCdn.bucketName}) is nearing full capacity. Searching for an alternative...`);

    // Fetch all inactive CDNs from the database
    const inactiveCdns = await CDNPath.find({ status: 'inactive' });
    if (!inactiveCdns || inactiveCdns.length === 0) {
      console.warn('No inactive CDNs found in the database.');
      return;
    }

    for (const cdn of inactiveCdns) {
      const cdnSpaceUsed = await getSpaceUsage(cdn.bucketName);
      console.log(`Checking CDN (${cdn.bucketName}): ${cdnSpaceUsed.usedSizeInGB} GB used`);

      if (cdnSpaceUsed.usedSizeInGB < 23) {
        console.log(`Switching to CDN: ${cdn.bucketName}`);

        // Update database to set the new CDN as active
        await CDNPath.updateMany({}, { $set: { status: 'inactive' } }); // Deactivate all
        await CDNPath.updateOne({ bucketName: cdn.bucketName }, { $set: { status: 'active' } }); // Activate new CDN

        // Cache the new active CDN in Redis
        await redisClient.set('activeCDN', JSON.stringify(cdn));

        console.log(`Successfully switched to CDN: ${cdn.bucketName}`);
        return;
      }
    }

    console.error('No suitable inactive CDN found. All CDNs are full or near full capacity.');
  } else {
    console.log(`Active CDN (${activeCdn.bucketName}) has sufficient space: ${spaceUsed.usedSizeInGB} GB.`);
  }
}

async function startSwitchingProcess() {
  console.log('Starting CDN switching process...');
  setInterval(async () => {
    try {
      await handleCdnSwitching();
    } catch (err) {
      console.error('Error in CDN switching process:', err);
    }
  }, 30000); // Check every 30 seconds
}

// Start the worker
startSwitchingProcess();

if (parentPort) {
  parentPort.postMessage('CDN worker started.');
} else {
  console.error('Error: parentPort is not available.');
}
