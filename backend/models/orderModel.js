const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    pinCode: {
      type: Number,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: Number,
    },
    company: {
      type: String,
    },
    appartment: {
      type: String,
    },
  },
  saveUserShippingInfo: {
    type: Boolean,
  },
  specialInstruction: {
    type: String,
  },
  orderItems: [
    {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      noOfItems: {
        type: Number,
        required: true,
      },
      noOfCo2: {
        type: Number,
        required: true,
      },
      productType: {
        type: String,
      },
      countries: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Country",
          required: true,
        },
      ],
      image: {
        type: String,
        required: true,
      },
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
      },
      variant: {
        name: {
          type: String,
        },
        price: {
          type: Number,
        },
        stock: {
          type: Number,
        },
      },

      // Add an object to store gift item information
      giftItem: {
        recipientEmail: {
          type: String,
        },
        recipientName: {
          type: String,
        },
        message: {
          type: String,
        },
        date: {
          type: Date,
        },
      },
    },
  ],

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    // required: true,
  },
  paymentInfo: {
    id: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    subscriptionId: {
      type: String,
      default: null,
    },
    priceId: {
      type: String,
      default: null,
    },
    subscriptionDuration: {
      type: String,
      default: null,
    },
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  orderStatus: {
    type: String,
    required: true,
    default: "Processing",
  },
  orderNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  avatar: {
    type: String,
  },
  email: {
    type: String,
    required: true, // Add the email field to store the user's email with the order
  },
  emailOffers: {
    type: Boolean,
  },
  subscriptionStatus: {
    type: String,
    enum: ["active", "cancel"],
  },

  treeCount: {
    type: Number,
    default: 1,
  },
  lastUpdateDate: {
    type: Date,
  },
});

module.exports = mongoose.model("Order", orderSchema);

// Middleware to generate and set the orderNumber before saving
orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    // Find the highest orderNumber and increment it by 1
    const highestOrder = await this.constructor
      .findOne()
      .sort({ orderNumber: -1 });
    this.orderNumber = highestOrder ? highestOrder.orderNumber + 1 : 1000;
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
