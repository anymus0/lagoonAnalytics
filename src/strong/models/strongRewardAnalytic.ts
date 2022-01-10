export interface strongRewardAnalytics {
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
