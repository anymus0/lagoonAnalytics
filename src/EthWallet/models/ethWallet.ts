import mongoose from "mongoose";

export interface ethWallet {
  _id: typeof mongoose.Schema.Types.ObjectId;
  address: string;
}
