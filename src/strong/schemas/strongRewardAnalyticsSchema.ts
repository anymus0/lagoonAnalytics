import mongoose from "mongoose";
import {
  serviceContractAnalytics,
  dailyAnalytics,
  strongRewardAnalytics,
} from "./../models/strongRewardAnalytic.js";

const serviceContractAnalyticsSchema: mongoose.Schema<serviceContractAnalytics> =
  new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    numOfNodes: { type: Number, required: true },
    unclaimedRewards: { type: Number, required: true },
  });

const dailyAnalyticsSchema: mongoose.Schema<dailyAnalytics> =
  new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    marketPriceinUSD: { type: Number, required: true },
    allUnclaimedRewards: { type: Number, required: true },
    allUnclaimedRewardsInUSD: { type: Number, required: true },
    allClaimedRewards: { type: Number, required: true },
    allClaimedRewardsInUSD: { type: Number, required: true },
    allRewards: { type: Number, required: true },
    allRewardsInUSD: { type: Number, required: true },
    numOfAllNodes: { type: Number, required: true },
    serviceV1: { type: serviceContractAnalyticsSchema, required: true },
    serviceV2: { type: serviceContractAnalyticsSchema, required: true },
  });

const strongRewardAnalyticsSchema: mongoose.Schema<strongRewardAnalytics> =
  new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    date: { type: Date, required: true },
    analytics: { type: dailyAnalyticsSchema, required: true },
    differencesFromPreviousDay: { type: dailyAnalyticsSchema, required: false },
  });

export const StrongRewardAnalytics: mongoose.Model<strongRewardAnalytics> =
  mongoose.model("StrongRewardAnalytics", strongRewardAnalyticsSchema);
