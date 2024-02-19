const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorhandler");
const SendEmail = require("../utils/sendEmail");

// Function to update product stock
async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.stock -= quantity;
  await product.save({ validateBeforeSave: false });
}

// Create a new order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    saveUserShippingInfo,
    specialInstruction,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    emailOffers,
    variant,
  } = req.body;

  // Check if the user is logged in, if not, ask for email
  const userEmail = req.user ? req.user.email : req.body.email;

  if (!userEmail) {
    return next(
      new ErrorHandler("Please provide an email address for the order", 400)
    );
  }

  // Find the highest orderNumber and increment it by 1
  const highestOrder = await Order.findOne().sort({ orderNumber: -1 });
  const orderNumber = highestOrder ? highestOrder.orderNumber + 1 : 1000;

  // Map the order items to add the giftItem object
  const mappedOrderItems = orderItems.map((item) => ({
    ...item,
    giftItem: item.giftItem || {},
  }));

  const isSubscriptionProduct = orderItems.some(
    (val) => val.productType === "subscription"
  );

  const isVariantProduct = orderItems.some(
    (val) => val.productType === "variants"
  );

  // Create a new order with the orderNumber
  const order = new Order({
    shippingInfo,
    saveUserShippingInfo,
    specialInstruction,
    orderItems: mappedOrderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    email: userEmail,
    emailOffers,
    orderNumber,
    ...(isSubscriptionProduct ? { subscriptionStatus: "active" } : {}),
    ...(isVariantProduct ? { variant: variant } : {}),
  });

  // Email receipt message
  const emailMessage = `
  <html>
    <body>
      <div style="background-color: #f5f5f5; padding: 20px; margin: 0; text-align: center;">
        <h2 style="color: #333;">Thank you for placing your order.</h2>
        <p style="color: #666;">Here is your receipt:</p>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <th style="border: 1px solid #000; padding: 8px; text-align: left; background-color: #ccc;">Product Name</th>
            <th style="border: 1px solid #000; padding: 8px; text-align: right; background-color: #ccc;">Price (Rs.)</th>
            <th style="border: 1px solid #000; padding: 8px; text-align: right; background-color: #ccc;">Quantity</th>
            <th style="border: 1px solid #000; padding: 8px; text-align: right; background-color: #ccc;">Total (Rs.)</th>
          </tr>
          ${order.orderItems
            .map(
              (item) => `
              <tr>
                <td style="border: 1px solid #000; padding: 8px; text-align: left;">${
                  item.name
                }</td>
                <td style="border: 1px solid #000; padding: 8px; text-align: right;">${
                  item.price
                }</td>
                <td style="border: 1px solid #000; padding: 8px; text-align: right;">${
                  item.quantity
                }</td>
                <td style="border: 1px solid #000; padding: 8px; text-align: right;">${
                  item.price * item.quantity
                }</td>
              </tr>
              `
            )
            .join("")}
          <tr>
            <td colspan="3" style="border: 1px solid #000; padding: 8px; text-align: right; background-color: #eee; font-weight: bold;">Subtotal</td>
            <td style="border: 1px solid #000; padding: 8px; text-align: right;">${itemsPrice.toFixed(
              2
            )}</td>
          </tr>
          <tr>
            <td colspan="3" style="border: 1px solid #000; padding: 8px; text-align: right; background-color: #eee; font-weight: bold;">Tax</td>
            <td style="border: 1px solid #000; padding: 8px; text-align: right;">${taxPrice.toFixed(
              2
            )}</td>
          </tr>
          <tr>
            <td colspan="3" style="border: 1px solid #000; padding: 8px; text-align: right; background-color: #eee; font-weight: bold;">Shipping</td>
            <td style="border: 1px solid #000; padding: 8px; text-align: right;">${shippingPrice.toFixed(
              2
            )}</td>
          </tr>
          <tr>
            <td colspan="3" style="border: 1px solid #000; padding: 8px; text-align: right; background-color: #eee; font-weight: bold;">Total</td>
            <td style="border: 1px solid #000; padding: 8px; text-align: right; color: green;">${totalPrice.toFixed(
              2
            )}</td>
          </tr>
        </table>

        <p style="color: #666;">Special Instructions: ${
          specialInstruction || "N/A"
        }</p>
      </div>
    </body>
  </html>
`;

  const emailPromises = [
    SendEmail({
      email: userEmail,
      subject: "Order Confirmation",
      message: emailMessage,
    }),
  ];

  // Send emails to gift recipients
  mappedOrderItems.forEach((item) => {
    if (item.giftItem && item.giftItem.recipientEmail) {
      const giftMessage = item.giftItem.message || "No message provided";
      const emailGiftMessage = `
      <html>
      <body>
        <div style="background-color: #f5f5f5; padding: 20px; margin: 0; text-align: center;">
          <h2 style="color: #333;">Dear ${item.giftItem.recipientName},</h2>
          <p style="color: #666;">A special surprise awaits you!</p>
          <p style="color: #666;">You've received a thoughtful gift from ${
            shippingInfo.firstName
          } ${shippingInfo.lastName} via Our Forest Website .</p>
          <p style="color: #666;">Here's a sneak peek:</p>
    
          <table style="width: 50%; margin: 0 auto; border-collapse: collapse;">
            <tr>
              <th style="border: 1px solid #000; padding: 8px; text-align: left; background-color: #ccc;">Product Name</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: right; background-color: #ccc;">Quantity</th>
            </tr>
            ${order.orderItems
              .map(
                (item) => `
                <tr>
                  <td style="border: 1px solid #000; padding: 8px; text-align: left;">${item.name}</td>
                  <td style="border: 1px solid #000; padding: 8px; text-align: right;">${item.quantity}</td>
                </tr>
                `
              )
              .join("")}
        
          </table>
    
          <p style="color: #666;">${shippingInfo.firstName} ${
        shippingInfo.lastName
      } has also included a special message for you:</p>
          <p style="color: #666; font-style: italic;">"${giftMessage}"</p>
    
          <p style="color: #666;">We hope this gift brings you joy and brightens your day!</p>
      
        </div>
      </body>
    </html>
    `;
      emailPromises.push(
        SendEmail({
          email: item.giftItem.recipientEmail,
          subject: "You've received a gift!",
          message: emailGiftMessage,
        })
      );
    }
  });

  // Update product stock for each item in the order
  for (const item of mappedOrderItems) {
    await updateStock(item.product, item.quantity);
  }

  // Use Promise.all to send emails concurrently
  await Promise.all(emailPromises);

  // Save the order to generate the orderNumber
  await order.save();

  res.status(201).json({
    success: true,
    order,
  });
});

// Get All Orders
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();

  res.status(200).json({
    success: true,
    orders,
  });
});
exports.getCombinedOrders = async (req, res, next) => {
  try {
    const pipeline = [
      {
        $unwind: "$orderItems",
      },
      {
        $lookup: {
          from: "users", // Assuming "users" is the name of your user collection
          localField: "email",
          foreignField: "email",
          as: "user",
        },
      },
      {
        $unwind: { path: "$user", preserveNullAndEmptyArrays: true }, // Preserve documents without a user match
      },
      {
        $group: {
          _id: "$email",
          avatar: { $first: { $ifNull: ["$user.avatar", null] } }, // Use $ifNull to handle cases where avatar doesn't exist
          email: { $first: "$email" },
          name: {
            $first: {
              $concat: [
                { $ifNull: ["$shippingInfo.firstName", ""] },
                " ",
                { $ifNull: ["$shippingInfo.lastName", ""] },
              ],
            },
          },
          totalNoOfItems: { $sum: "$orderItems.noOfItems" },
          totalNoOfCo2: { $sum: "$orderItems.noOfCo2" },
        },
      },
      {
        $sort: { totalNoOfItems: -1 },
      },
    ];

    const combinedOrders = await Order.aggregate(pipeline);

    res.status(200).json({
      success: true,
      combinedOrders,
    });
  } catch (error) {
    next(error);
  }
};

// Get Orders by Email
exports.getOrdersByEmail = catchAsyncErrors(async (req, res, next) => {
  const userEmail = req.params.email;

  const orders = await Order.find({ email: userEmail });

  const orderCount = orders.length;
  const totalAmount = orders.reduce(
    (total, order) => total + order.totalPrice,
    0
  );

  res.status(200).json({
    success: true,
    orders,
    orderCount,
    totalAmount,
  });
});
// Get Order Items by Email
exports.getOrderItemsByEmail = catchAsyncErrors(async (req, res, next) => {
  const userEmail = req.params.email;

  const orders = await Order.find({ email: userEmail });

  const orderItemsMap = new Map(); // Use a Map to store unique order items

  orders.forEach((order) => {
    let subscription = null;
    if (order.paymentInfo.subscriptionId) {
      subscription = order.paymentInfo.subscriptionId;
    }
    order.orderItems.forEach((item) => {
      let key = item.product.toString();
      if (item.productType === "subscription")
        key = key + Math.floor(Math.random() * 1000000);
      if (orderItemsMap.has(key) && item.productType !== "subscription") {
        const existingItem = orderItemsMap.get(key);
        existingItem.purchaseCount += 1;
        existingItem.quantity += item.quantity;
      } else {
        orderItemsMap.set(key, {
          _id: order._id,
          priceId: order.paymentInfo.priceId,
          product: item.product,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
          countries: item.countries,
          purchaseCount: 1,
          type: item.productType,
          subscriptionId: subscription,
          ...(item.productType === "subscription"
            ? { subscriptionStatus: order.subscriptionStatus }
            : {}),
        });
      }
    });
  });

  const orderItems = Array.from(orderItemsMap.values());

  res.status(200).json({
    success: true,
    orderItems,
    orderCount: orderItems.length,
  });
});

// Update Order Status by Email
exports.updateOrderStatusByEmail = catchAsyncErrors(async (req, res, next) => {
  const userEmail = req.params.email;
  const orderId = req.params.id;

  const order = await Order.findOneAndUpdate(
    { _id: orderId, email: userEmail },
    { orderStatus: req.body.status },
    { new: true }
  );

  if (!order) {
    return next(
      new ErrorHandler("Order not found with this Id and email", 404)
    );
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// Delete Order by Email
exports.deleteOrderByEmail = catchAsyncErrors(async (req, res, next) => {
  const userEmail = req.params.email;
  const orderId = req.params.id;

  const order = await Order.findOneAndDelete({
    _id: orderId,
    email: userEmail,
  });

  if (!order) {
    return next(
      new ErrorHandler("Order not found with this Id and email", 404)
    );
  }

  res.status(200).json({
    success: true,
  });
});

// Get Single Order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// Update Order Status -- Admin
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }

  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (o) => {
      await updateStock(o.product, o.quantity);
    });
  }
  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

// Delete Order -- Admin
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });
});
