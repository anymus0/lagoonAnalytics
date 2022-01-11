import { env } from "process";
import express from "express";
import compression from "compression";
import mongoose from "mongoose";
import ExpressMongoSanitize from "express-mongo-sanitize";
import cors from "cors";
import helmet from "helmet";
// routes
import ethWalletRoute from "./EthWallet/routes/index.js";
import strongRoute from "./strong/routes/index.js";
import defaultRoutes from "./global/routes/defaultRoutes.js";

// dotenv
import dotenv from 'dotenv';
dotenv.config();

// define port
const port = env.PORT || 3000;
// init express app
const app = express();
// use cors in dev mode only
if (env.NODE_ENV !== "production") {
  app.use(cors());
}
// compress every request
app.use(compression());
// add set of security features
app.use(helmet());
// sanitize user-supplied data to prevent MongoDB Operator Injection
app.use(ExpressMongoSanitize());
// parse JSON
app.use(express.json());
// ethWaller routes
app.use("/ethWallet", ethWalletRoute);
// $STRONG routes
app.use("/strong", strongRoute);
// load default routes last
app.use("/", defaultRoutes);

const start = async () => {
  try {
    // MongoDB server connection setup
    const mongoDB = process.env.DB_URI;
    if (!mongoDB) throw new Error("MongoDB connection URI is missing!");
    mongoose.connect(mongoDB);
    const db = mongoose.connection;
    // Bind connection to error event (to get notification of connection errors)
    db.on("error", console.error.bind(console, "MongoDB connection error:"));
    console.log(`Server is listening on port ${port}`);
    app.listen(port);
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
};

// start server
start();
