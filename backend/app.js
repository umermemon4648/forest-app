const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
const errorMiddleware = require("./middleware/error");
const cors = require("cors");
app.use(
  "/media/uploads",
  express.static(path.join(__dirname, "./media/uploads"))
);

// Config
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "config/config.env" });
}

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || process.env.CLIENT,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

// Import your default categories and countries creation script
const initializeDefaults = require("./utils/initial");

// Call the script to create default categories and countries
initializeDefaults();

// Route Imports
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");
const category = require("./routes/categoryRoute");
const country = require("./routes/countryRoute");
const email = require("./routes/emailRoute");
const customer = require("./routes/customerRoute");
const emailSubscription = require("./routes/emailSubscriptionRoute");
const media = require("./routes/mediaRoute");
const coupon = require("./routes/couponRoute");
const subscription = require("./routes/subscriptionRoute");

// Use Routes
app.use("/api/v1", coupon);
app.use("/api/v1", subscription);
app.use("/api/v1", media);
app.use("/api/v1", email);
app.use("/api/v1", category);
app.use("/api/v1", country);
app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);
app.use("/api/v1", customer);
app.use("/api/v1", emailSubscription);

// Middleware for Errors
app.use(errorMiddleware);

// Middleware for unmatched routes
app.use((req, res) => {
  if (req.url === "/") {
    // Handle the root URL
    res.status(200).send("Connected success");
  } else {
    // Handle other undefined routes
    res.status(404).send("Route not found");
  }
});

module.exports = app;
