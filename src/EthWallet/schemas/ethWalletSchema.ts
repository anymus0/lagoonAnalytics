import mongoose from "mongoose";
import { ethWallet } from "../models/ethWallet.js";

const ethWalletSchema: mongoose.Schema<ethWallet> = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  address: { type: String, required: true },
});

export const EthWallet: mongoose.Model<ethWallet> =
  mongoose.model("EthWallet", ethWalletSchema);