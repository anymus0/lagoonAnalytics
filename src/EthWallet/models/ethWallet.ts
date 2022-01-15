import mongoose from "mongoose";

export interface ethWallet {
  _id: mongoose.Types.ObjectId;
  address: string;
}
