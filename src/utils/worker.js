// const { autoForwardQueue, autoCancelQueue } = require('./queue');
// const { MnfDeliveryChallan, RetailerPartialReq } = require('../models');
// //const { sendNotification } = require('./notification'); // Import correctly
// const { processRetailerOrders } = require('../services/type2.services/mnf.delivery.challan.service');

// // Process auto-forward job
// autoForwardQueue.process(async (job) => {
//   try {
//     // console.log("🚀 Processing auto-forward job...");
//     const { orderId } = job.data;
//     const order = await MnfDeliveryChallan.findById(orderId);

//     if (!order || order.status !== 'Pending') return;

//     order.status = 'Forwarded';
//     order.updatedAt = new Date();
//     await order.save();

//     console.log(`✅ Order ${order.poNumber} auto-forwarded.`);
//     await processRetailerOrders(orderId);
//     // Send real-time notification
//     // await sendNotification(order.email, `Order ${order.poNumber} has been auto-forwarded.`);

//     // Schedule auto-cancel if no action in 4 hours
//     await autoCancelQueue.add({ orderId: order._id }, { delay: 40 * 1000 }); // 4 * 60 * 60 * 1000
//   } catch (error) {
//     console.error('❌ Auto-forward error:', error);
//   }
// });

// // Process auto-cancel job
// autoCancelQueue.process(async (job) => {
//   try {
//     const { orderId } = job.data;
//     const orders = await RetailerPartialReq.find({ deliveryChallanId: orderId, status: 'pending' });

//     if (!orders.length) {
//       console.log(`⚠️ No pending orders found for Delivery Challan ID: ${orderId}`);
//       return;
//     }

//     // Update status to 'rejected' for all matching orders
//     await RetailerPartialReq.updateMany({ deliveryChallanId: orderId, status: 'pending' }, { $set: { status: 'rejected' } });

//     orders.forEach((order) => {
//       console.log(`❌ Order ${order.poNumber} automatically rejected.`);
//       // Send real-time notification (uncomment when needed)
//       // sendNotification(order.retailerEmail, `Order ${order.poNumber} has been automatically rejected.`);
//     });
//   } catch (error) {
//     console.error('❌ Auto-cancel error:', error);
//   }
// });

// console.log('🚀 Workers running for auto-processing orders.');
