const { autoForwardQueue, autoCancelQueue } = require("./queue");
const { MnfDeliveryChallan } = require("../models");
const { sendNotification } = require("../utils/notification"); // Import correctly

// Process auto-forward job
autoForwardQueue.process(async (job) => {
    try {
        const { orderId } = job.data;
        const order = await MnfDeliveryChallan.findById(orderId);

        if (!order || order.status !== "Pending") return;

        order.status = "Auto Forwarded";
        order.updatedAt = new Date();
        await order.save();

        console.log(`✅ Order ${order.poNumber} auto-forwarded.`);

        // Send real-time notification
        await sendNotification(order.email, `Order ${order.poNumber} has been auto-forwarded.`);

        // Schedule auto-cancel if no action in 4 hours
        // await autoCancelQueue.add({ orderId: order._id }, { delay: 4 * 60 * 60 * 1000 });
    } catch (error) {
        console.error("❌ Auto-forward error:", error);
    }
});

// Process auto-cancel job
// autoCancelQueue.process(async (job) => {
//     try {
//         const { orderId } = job.data;
//         const order = await MnfDeliveryChallan.findById(orderId);

//         if (!order || order.status !== "Auto Forwarded") return;

//         order.status = "Canceled";
//         order.updatedAt = new Date();
//         await order.save();

//         console.log(`❌ Order ${order.orderNumber} automatically canceled.`);

//         // Send real-time notification
//         await sendNotification(order.email, `Order ${order.poNumber} has been automatically canceled.`);
//     } catch (error) {
//         console.error("❌ Auto-cancel error:", error);
//     }
// });

console.log("🚀 Workers running for auto-processing orders.");
