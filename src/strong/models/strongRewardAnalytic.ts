import mongoose from 'mongoose';

export interface strongRewardAnalytics {
  _id: mongoose.Types.ObjectId;
  date: Date;
  marketPriceinUSD: number;
  unclaimedRewards: number;
  unclaimedRewardsInUSD: number;
  claimedRewards: number;
  claimedRewardsInUSD: number;
  allRewards: number;
  allRewardsInUSD: number;
  numOfNodes: number;
  serviceV1NumOfNodes: number;
  serviceV1UnclaimedRewards: number;
  serviceV2NumOfNodes: number;
  serviceV2UnclaimedRewards: number;
}
