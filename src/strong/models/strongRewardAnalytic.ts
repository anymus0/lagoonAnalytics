import mongoose from 'mongoose';

export interface serviceContractAnalytics {
  _id: mongoose.Types.ObjectId,
  numOfNodes: number;
  unclaimedRewards: number;
}

export interface analyticsSnapshot {
  _id: mongoose.Types.ObjectId,
  marketPriceinUSD: number;
  allUnclaimedRewards: number;
  allUnclaimedRewardsInUSD: number;
  allClaimedRewards: number;
  allClaimedRewardsInUSD: number;
  allRewards: number;
  allRewardsInUSD: number;
  numOfAllNodes: number;
  serviceV1: serviceContractAnalytics;
  serviceV2: serviceContractAnalytics;
}

export interface strongRewardAnalytics {
  _id: mongoose.Types.ObjectId;
  date: Date;
  analytics: analyticsSnapshot;
  differencesFromPreviousSnapshot: analyticsSnapshot | null;
}
