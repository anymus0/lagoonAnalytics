import mongoose from "mongoose";
import { strongRewardAnalytics } from "./../models/strongRewardAnalytic.js";

const strongRewardAnalyticsSchema: mongoose.Schema<strongRewardAnalytics> = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  date: { type: Date, required: true },
  marketPriceinUSD: { type: Number, required: true },
  unclaimedRewards: { type: Number, required: true },
  claimedRewards: { type: Number, required: true },
  claimedRewardsInUSD: { type: Number, required: true },
  allRewards: { type: Number, required: true },
  allRewardsInUSD: { type: Number, required: true },
  numOfNodes: { type: Number, required: true },
  serviceV1NumOfNodes: { type: Number, required: true },
  serviceV1UnclaimedRewards: { type: Number, required: true },
  serviceV2NumOfNodes: { type: Number, required: true },
  serviceV2UnclaimedRewards: { type: Number, required: true },
});

export const StrongRewardAnalytics: mongoose.Model<strongRewardAnalytics> =
  mongoose.model("StrongRewardAnalytics", strongRewardAnalyticsSchema);