require("dotenv").config();
const express = require("express");
const server = express();
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const cookieParser = require("cookie-parser");
const { createProduct } = require("./controller/Product");
const productsRouter = require("./routes/Products");
const categoriesRouter = require("./routes/Categories");
const brandsRouter = require("./routes/Brands");
const usersRouter = require("./routes/Users");
const authRouter = require("./routes/Auth");
const cartRouter = require("./routes/Cart");
const ordersRouter = require("./routes/Order");
const paymentRouter = require("./routes/Payment");
const { User } = require("./model/User");
// const { isAuth, sanitizeUser, cookieExtractor } = require("./services/common");

const { isAuth } = require("./middlewares/auth");

const path = require("path");
const { Order } = require("./model/Order");
const { env } = require("process");

const dns = require('dns');
// dns.setDefaultResultOrder('ipv4first');



// Webhook

const endpointSecret = process.env.ENDPOINT_SECRET;

server.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];
    
    let event;
    
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    
    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;
        
        const order = await Order.findById(
          paymentIntentSucceeded.metadata.orderId
        );
        order.paymentStatus = "received";
        await order.save();
        
        break;
        // ... handle other event types
        default:
          console.log(`Unhandled event type ${event.type}`);
        }
        
        // Return a 200 response to acknowledge receipt of the event
        response.send();
      }
    );
    
    // JWT options
    
    // const opts = {};
    // opts.jwtFromRequest = cookieExtractor;
    // opts.secretOrKey = process.env.JWT_SECRET_KEY;

//middlewares
server.use(morgan("dev"));
// server.use(express.static(path.resolve(__dirname, "build")));
server.use(cookieParser());
// server.use(
  //   session({
    //     secret: process.env.SESSION_KEY,
    //     resave: false, // don't save session if unmodified
    //     saveUninitialized: false, // don't create session until something stored
    //   })
    // );
    // server.use(passport.authenticate("session"));
    server.use(
      cors({
        exposedHeaders: ["X-Total-Count"],
      })
    );
    server.use(express.json()); // to parse req.body

server.use("/payment", paymentRouter.router);

    // server.use("/payment", require("./routes/Payment"));
    // server.use("/orders", require("./routes/Order"));

server.use("/products", productsRouter.router);
// we can also use JWT token for client-only auth
server.use("/categories", categoriesRouter.router);
server.use("/brands", brandsRouter.router);
server.use("/users", isAuth, usersRouter.router);
server.use("/auth", authRouter.router);
server.use("/cart", isAuth, cartRouter.router);
server.use("/orders", isAuth, ordersRouter.router);

// this line we add to make react router work in case of other routes doesnt match
server.get("*", (req, res) =>
  res.sendFile(path.resolve("build", "index.html"))
);

// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SERVER_KEY);

server.post("/create-payment-intent", async (req, res) => {
  const { totalAmount, orderId } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount * 100, // for decimal compensation
    currency: "inr",
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      orderId,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

// main().catch((err) => console.log(err));

// async function main() {
//   await mongoose.connect(process.env.MONGODB_URL);
//   console.log("database connected");
// }

// dns.setDefaultResultOrder('verbatim');
// 

// dns.setDefaultResultOrder('ipv4first');
// async function main() {
//   // await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce")
//   await mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER_URL}/${process.env.MONGODB_DB_NAME}?retryWrites=true&w=majority`)
// .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('MongoDB connection error:', err));

//   // console.log("database connected");
// }
// import mongoose from 'mongoose';

//mongodb+srv://rahulohol:<db_password>@cluster0.qyig40b.mongodb.net/?appName=Cluster0
async function connectDB() {
  try {
    await mongoose.connect(
       `mongodb+srv://${process.env.MONGODB_USERNAME}:` +
      `${encodeURIComponent(process.env.MONGODB_PASSWORD)}` +
      `@cluster0.qyig40b.mongodb.net/ecommerce?retryWrites=true&w=majority`,
      {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      }
    );

    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1); // ❗ crash app if DB fails
  }
}
connectDB();

// export default connectDB;



// server.listen(process.env.PORT, () => {
//   console.log("server started ", process.env.PORT);
// });


server.listen(8000, () => {
  console.log("server started ", 8000);
});
