// const redisClient = require('../utils/redis');
const { CDNPath } = require('../models');
const { getSpaceUsage } = require('../utils/upload');
const logger = require('../config/logger');

// Expiration time for Redis cache in seconds
const REDIS_EXPIRATION_TIME = 3600; // 1 hour

// Cache for active CDN and all CDNs
let activeCdnCache = null;
let cdnDataCache = [];

// Refresh CDN data cache
const refreshCdnData = async () => {
  logger.info('Refreshing CDN data cache...');
  cdnDataCache = await CDNPath.find({});
};

// Get active CDN from cache or database
const getCachedActiveCdn = async () => {
  if (!activeCdnCache) {
    logger.info('Fetching active CDN...');
    const cachedActiveCdn = await redisClient.get('activeCDN');
    if (cachedActiveCdn) {
      activeCdnCache = JSON.parse(cachedActiveCdn);
    } else {
      const dbActiveCdn = await CDNPath.findOne({ status: 'active' });
      if (!dbActiveCdn) {
        logger.error('No active CDN found in the database.');
        return null;
      }
      activeCdnCache = dbActiveCdn;
      await redisClient.set('activeCDN', JSON.stringify(activeCdnCache), 'EX', REDIS_EXPIRATION_TIME);
    }
  }
  return activeCdnCache;
};

// Update active CDN in cache and database
const updateCachedActiveCdn = async (newActiveCdn) => {
  activeCdnCache = newActiveCdn;
  await redisClient.set('activeCDN', JSON.stringify(newActiveCdn), 'EX', REDIS_EXPIRATION_TIME);
  logger.info(`Updated active CDN in cache: ${newActiveCdn.bucketName}`);
};

// Get cached space usage for a bucket
const getCachedSpaceUsage = async (bucketName) => {
  const cachedUsage = await redisClient.get(`spaceUsage:${bucketName}`);
  if (cachedUsage) {
    return JSON.parse(cachedUsage);
  }
  const spaceUsage = await getSpaceUsage(bucketName);
  await redisClient.set(`spaceUsage:${bucketName}`, JSON.stringify(spaceUsage), 'EX', 300); // Cache for 5 minutes
  return spaceUsage;
};

// Handle CDN switching logic
const handleCdnSwitching = async () => {
  logger.info('Starting CDN switching process...');

  const activeCdn = await getCachedActiveCdn();
  if (!activeCdn) return;

  const spaceUsed = await getCachedSpaceUsage(activeCdn.bucketName);
  logger.warn(`Space usage for active CDN (${activeCdn.bucketName}): ${spaceUsed.usedSizeInGB} GB`);

  if (spaceUsed.usedSizeInGB >= 2) {
    logger.warn(`Active CDN (${activeCdn.bucketName}) nearing capacity. Searching for alternatives...`);

    const inactiveCdns = cdnDataCache.filter((cdn) => cdn.status === 'inactive');
    if (!inactiveCdns.length) {
      logger.error('No inactive CDNs available.');
      return;
    }

    // Check space usage for inactive CDNs in parallel
    const spaceUsageResults = await Promise.all(inactiveCdns.map((cdn) => getCachedSpaceUsage(cdn.bucketName)));

    const suitableCdn = inactiveCdns.find((cdn, index) => spaceUsageResults[index].usedSizeInGB < 2);

    if (suitableCdn) {
      logger.info(`Switching to CDN: ${suitableCdn.bucketName}`);

      // Update database
      await CDNPath.updateMany({}, { $set: { status: 'inactive' } }); // Set all to inactive
      await CDNPath.updateOne({ bucketName: suitableCdn.bucketName }, { $set: { status: 'active' } }); // Activate new CDN

      // Update Redis and cache
      await updateCachedActiveCdn(suitableCdn);

      logger.info(`Successfully switched to CDN: ${suitableCdn.bucketName}`);
    } else {
      logger.error('No suitable inactive CDN found. All CDNs are full or near capacity.');
    }
  } else {
    logger.info(`Active CDN (${activeCdn.bucketName}) has sufficient space: ${spaceUsed.usedSizeInGB} GB.`);
  }
};

// Dynamic interval logic to optimize process frequency
const dynamicIntervalCheck = async () => {
  try {
    await refreshCdnData(); // Refresh CDN data cache
    const activeCdn = await getCachedActiveCdn();
    if (!activeCdn) {
      logger.error('No active CDN available for checking.');
      return setTimeout(dynamicIntervalCheck, 900000); // Retry in 5 minutes
    }

    const spaceUsed = await getCachedSpaceUsage(activeCdn.bucketName);
    if (spaceUsed.usedSizeInGB < 1.8) {
      logger.info('Active CDN has sufficient space. Pausing checks for 5 minutes.');
      setTimeout(dynamicIntervalCheck, 900000); // Pause for 5 minutes
    } else {
      logger.info('Active CDN nearing capacity. Checking for alternatives...');
      await handleCdnSwitching();
      setTimeout(dynamicIntervalCheck, 60000); // Resume normal checks after 20 seconds
    }
  } catch (err) {
    logger.error('Error in CDN switching process:', err);
    setTimeout(dynamicIntervalCheck, 60000); // Retry in 1 minute on error
  }
};

// Start dynamic switching process
// dynamicIntervalCheck();

// async function handleCdnSwitching() {
//     logger.info("Fetching active CDN from Redis...");

//     // Fetch the active CDN from Redis cache
//     let activeCdn = await redisClient.get('activeCDN');
//     if (!activeCdn) {
//         logger.info("No active CDN in Redis. Fetching from database...");
//         activeCdn = await CDNPath.findOne({ status: 'active' });
//         if (!activeCdn) {
//             logger.error("No active CDN found in the database.");
//             return;
//         }

//         // Cache the active CDN in Redis with an expiration time
//         await redisClient.set('activeCDN', JSON.stringify(activeCdn), 'EX', REDIS_EXPIRATION_TIME);
//     } else {
//         activeCdn = JSON.parse(activeCdn);
//     }

//     logger.info(`Active CDN: ${activeCdn.bucketName}`);

//     // Check space usage of the active CDN bucket
//     const spaceUsed = await getSpaceUsage(activeCdn.bucketName);
//     logger.warn(`Space usage for bucket (${activeCdn.bucketName}): ${spaceUsed.usedSizeInGB} GB`);

//     if (spaceUsed.usedSizeInGB >= 2) {
//         logger.warn(`Active CDN (${activeCdn.bucketName}) is nearing full capacity. Searching for an alternative...`);

//         // Fetch all inactive CDNs from the database
//         const inactiveCdns = await CDNPath.find({ status: 'inactive' });
//         if (!inactiveCdns || inactiveCdns.length === 0) {
//             logger.warn("No inactive CDNs found in the database.");
//             return;
//         }

//         for (const cdn of inactiveCdns) {
//             const cdnSpaceUsed = await getSpaceUsage(cdn.bucketName);
//             logger.warn(`Checking CDN (${cdn.bucketName}): ${cdnSpaceUsed.usedSizeInGB} GB used`);

//             if (cdnSpaceUsed.usedSizeInGB < 2) {
//                 logger.info(`Switching to CDN: ${cdn.bucketName}`);

//                 // Update database to set the new CDN as active
//                 await CDNPath.updateMany({}, { $set: { status: 'inactive' } }); // Deactivate all
//                 await CDNPath.updateOne({ bucketName: cdn.bucketName }, { $set: { status: 'active' } }); // Activate new CDN

//                 // Cache the new active CDN in Redis with an expiration time
//                 await redisClient.set('activeCDN', JSON.stringify(cdn), 'EX', REDIS_EXPIRATION_TIME);

//                 logger.info(`Successfully switched to CDN: ${cdn.bucketName}`);
//                 return;
//             }
//         }

//         logger.error("No suitable inactive CDN found. All CDNs are full or near full capacity.");
//     } else {
//         logger.info(`Active CDN (${activeCdn.bucketName}) has sufficient space: ${spaceUsed.usedSizeInGB} GB.`);
//     }
// }

// async function startSwitchingProcess() {
//     logger.info("Starting CDN switching process...");
//     setInterval(async () => {
//         try {
//             await handleCdnSwitching();
//         } catch (err) {
//             logger.error("Error in CDN switching process:", err);
//         }
//     }, 20000); // Check every 30 seconds
// }

// // Start the process
// startSwitchingProcess();
